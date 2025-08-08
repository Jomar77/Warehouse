using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Dtos.Inward;
using WarehouseAPI.Models;

namespace WarehouseAPI.Services
{
    public class InwardService : IInwardService
    {
        private readonly WarehouseContext _context;

        public InwardService(WarehouseContext context)
        {
            _context = context;
        }

        public async Task<List<PendingPurchaseDto>> GetPendingPurchasesAsync()
        {
            var pendingPurchases = await _context.Purchases
                .Include(p => p.Supplier)
                .Include(p => p.PurchaseItems)
                    .ThenInclude(pi => pi.Product)
                .Where(p => p.Status == "Ordered")
                .Select(p => new PendingPurchaseDto
                {
                    PurchaseId = p.PurchaseId,
                    PoNumber = p.PoNumber,
                    SupplierName = p.Supplier.Name,
                    OrderDate = p.OrderDate,
                    ExpectedDelivery = p.ExpectedDelivery,
                    Status = p.Status,
                    Items = p.PurchaseItems.Select(pi => new PendingItemDto
                    {
                        ProductId = pi.ProductId,
                        ProductName = pi.Product.Name,
                        Sku = pi.Product.Sku,
                        QuantityOrdered = pi.QuantityOrdered,
                        QuantityReceived = pi.QuantityReceived,
                        QuantityPending = pi.QuantityOrdered - pi.QuantityReceived
                    }).ToList()
                })
                .ToListAsync();

            return pendingPurchases;
        }

        public async Task<PendingPurchaseDto?> GetPendingPurchaseByIdAsync(int purchaseId)
        {
            var purchase = await _context.Purchases
                .Include(p => p.Supplier)
                .Include(p => p.PurchaseItems)
                    .ThenInclude(pi => pi.Product)
                .Where(p => p.PurchaseId == purchaseId && p.Status == "Ordered")
                .Select(p => new PendingPurchaseDto
                {
                    PurchaseId = p.PurchaseId,
                    PoNumber = p.PoNumber,
                    SupplierName = p.Supplier.Name,
                    OrderDate = p.OrderDate,
                    ExpectedDelivery = p.ExpectedDelivery,
                    Status = p.Status,
                    Items = p.PurchaseItems.Select(pi => new PendingItemDto
                    {
                        ProductId = pi.ProductId,
                        ProductName = pi.Product.Name,
                        Sku = pi.Product.Sku,
                        QuantityOrdered = pi.QuantityOrdered,
                        QuantityReceived = pi.QuantityReceived,
                        QuantityPending = pi.QuantityOrdered - pi.QuantityReceived
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return purchase;
        }

        public async Task<ReceivePurchaseResponseDto> ReceivePurchaseAsync(ReceivePurchaseRequestDto request)
        {
            var purchase = await _context.Purchases
                .Include(p => p.PurchaseItems)
                    .ThenInclude(pi => pi.Product)
                .FirstOrDefaultAsync(p => p.PurchaseId == request.PurchaseId);

            if (purchase == null)
                throw new ArgumentException("Purchase not found");

            if (purchase.Status != "Ordered")
                throw new InvalidOperationException("Purchase is not in Ordered status");

            var receivedItems = new List<ReceivedItemDto>();

            // Update received quantities for each item
            foreach (var receivedItem in request.Items)
            {
                var purchaseItem = purchase.PurchaseItems
                    .FirstOrDefault(pi => pi.ProductId == receivedItem.ProductId);

                if (purchaseItem == null)
                    throw new ArgumentException($"Product {receivedItem.ProductId} not found in purchase order");

                var previousQuantityReceived = purchaseItem.QuantityReceived;
                purchaseItem.QuantityReceived += receivedItem.QuantityReceived;

                receivedItems.Add(new ReceivedItemDto
                {
                    ProductId = purchaseItem.ProductId,
                    ProductName = purchaseItem.Product.Name,
                    Sku = purchaseItem.Product.Sku,
                    QuantityOrdered = purchaseItem.QuantityOrdered,
                    QuantityReceived = purchaseItem.QuantityReceived,
                    PreviousQuantityReceived = previousQuantityReceived
                });
            }

            await _context.SaveChangesAsync();

            return new ReceivePurchaseResponseDto
            {
                PurchaseId = purchase.PurchaseId,
                PoNumber = purchase.PoNumber,
                Status = purchase.Status,
                ReceivedDate = purchase.ReceivedDate,
                Message = "Items received successfully. Purchase order remains open for further receiving.",
                ReceivedItems = receivedItems
            };
        }

        public async Task<ReceivePurchaseResponseDto> ApprovePurchaseReceiptAsync(int purchaseId)
        {
            var purchase = await _context.Purchases
                .Include(p => p.PurchaseItems)
                    .ThenInclude(pi => pi.Product)
                .FirstOrDefaultAsync(p => p.PurchaseId == purchaseId);

            if (purchase == null)
                throw new ArgumentException("Purchase not found");

            if (purchase.Status != "Ordered")
                throw new InvalidOperationException("Purchase is not in Ordered status");

            // Perform UPDATE without EF Core OUTPUT clause (avoids trigger conflict)
            var affected = await _context.Database.ExecuteSqlInterpolatedAsync($@"
                UPDATE [purchases]
                SET [status] = 'Received'
                WHERE [purchase_id] = {purchaseId} AND [status] = 'Ordered';");

            if (affected == 0)
                throw new InvalidOperationException("Purchase status was not updated (already received or not found).");

            // Reload the entity so trigger-updated values (e.g., received_date) are visible
            await _context.Entry(purchase).ReloadAsync();

            var receivedItems = purchase.PurchaseItems.Select(pi => new ReceivedItemDto
            {
                ProductId = pi.ProductId,
                ProductName = pi.Product.Name,
                Sku = pi.Product.Sku,
                QuantityOrdered = pi.QuantityOrdered,
                QuantityReceived = pi.QuantityReceived,
                PreviousQuantityReceived = 0
            }).ToList();

            return new ReceivePurchaseResponseDto
            {
                PurchaseId = purchase.PurchaseId,
                PoNumber = purchase.PoNumber,
                Status = purchase.Status,
                ReceivedDate = purchase.ReceivedDate,
                Message = "Purchase order approved and received. Inventory quantities have been updated.",
                ReceivedItems = receivedItems
            };
        }
    }
}