using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Dtos.Purchases;
using WarehouseAPI.Models;

namespace WarehouseAPI.Services
{
    public sealed class PurchaseService : IPurchaseService
    {
        private readonly WarehouseContext _dbContext;

        public PurchaseService(WarehouseContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<CreatePurchaseResponseDto> CreateAsync(CreatePurchaseRequestDto dto, CancellationToken cancellationToken = default)
        {
            if (dto.Items.Count == 0)
                throw new ArgumentException("At least one item is required.");

            var supplierExists = await _dbContext.Suppliers
                .AnyAsync(s => s.SupplierId == dto.SupplierId, cancellationToken);

            if (!supplierExists)
                throw new ArgumentException("Supplier not found.");

            var productIds = dto.Items.Select(i => i.ProductId).Distinct().ToArray();
            var products = await _dbContext.Products
                .Where(p => productIds.Contains(p.ProductId))
                .Select(p => new { p.ProductId })
                .ToListAsync(cancellationToken);

            var missingProductIds = productIds.Except(products.Select(p => p.ProductId)).ToArray();
            if (missingProductIds.Length > 0)
                throw new ArgumentException($"Products not found: {string.Join(", ", missingProductIds)}");

            var purchase = new Purchase
            {
                SupplierId = dto.SupplierId,
                PoNumber = GeneratePoNumber(dto.SupplierId),
                OrderDate = DateTime.UtcNow,
                ExpectedDelivery = dto.ExpectedDelivery,
                Status = "Ordered",
            };

            foreach (var item in dto.Items)
            {
                if (item.QuantityOrdered <= 0)
                    throw new ArgumentException("QuantityOrdered must be greater than zero.");

                purchase.PurchaseItems.Add(new PurchaseItem
                {
                    ProductId = item.ProductId,
                    QuantityOrdered = item.QuantityOrdered,
                    QuantityReceived = 0
                });
            }

            _dbContext.Purchases.Add(purchase);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return new CreatePurchaseResponseDto
            {
                PurchaseId = purchase.PurchaseId,
                PoNumber = purchase.PoNumber,
                Status = purchase.Status,
                OrderDate = purchase.OrderDate,
                ExpectedDelivery = purchase.ExpectedDelivery
            };
        }

        private static string GeneratePoNumber(int supplierId)
        {
            return $"PO-{DateTime.UtcNow:yyyyMMddHHmmss}-{supplierId}";
        }
    }
}