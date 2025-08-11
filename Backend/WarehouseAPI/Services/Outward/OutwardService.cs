using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Dtos.Outward;

namespace WarehouseAPI.Services
{
    public class OutwardService : IOutwardService
    {
        private readonly WarehouseContext _context;

        public OutwardService(WarehouseContext context)
        {
            _context = context;
        }

        public async Task<List<PendingOrderDto>> GetPendingOrdersAsync()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Where(o => o.Status == "Pending")
                .Select(o => new PendingOrderDto
                {
                    OrderId = o.OrderId,
                    CustomerName = o.CustomerName,
                    OrderDate = o.OrderDate,
                    Status = o.Status,
                    Items = o.OrderItems.Select(oi => new PendingOrderItemDto
                    {
                        ProductId = oi.ProductId,
                        ProductName = oi.Product.Name,
                        Sku = oi.Product.Sku,
                        Quantity = oi.Quantity,
                        QuantityOnHand = oi.Product.QuantityOnHand
                    }).ToList()
                })
                .ToListAsync();

            return orders;
        }

        public async Task<PendingOrderDto?> GetPendingOrderByIdAsync(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .Where(o => o.OrderId == orderId && o.Status == "Pending")
                .Select(o => new PendingOrderDto
                {
                    OrderId = o.OrderId,
                    CustomerName = o.CustomerName,
                    OrderDate = o.OrderDate,
                    Status = o.Status,
                    Items = o.OrderItems.Select(oi => new PendingOrderItemDto
                    {
                        ProductId = oi.ProductId,
                        ProductName = oi.Product.Name,
                        Sku = oi.Product.Sku,
                        Quantity = oi.Quantity,
                        QuantityOnHand = oi.Product.QuantityOnHand
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return order;
        }

        public async Task<ShipOrderResponseDto> ShipOrderAsync(ShipOrderRequestDto request)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.OrderId == request.OrderId);

            if (order == null)
                throw new ArgumentException("Order not found");
            if (order.Status != "Pending")
                throw new InvalidOperationException("Order is not in Pending status");

            // Determine items to ship: if not specified, ship all items fully
            var itemsToProcess = request.Items?.ToDictionary(i => i.ProductId, i => i.QuantityToShip)
                                   ?? order.OrderItems.ToDictionary(oi => oi.ProductId, oi => oi.Quantity);

            var shipped = new List<ShippedItemDto>();

            foreach (var oi in order.OrderItems)
            {
                if (!itemsToProcess.TryGetValue(oi.ProductId, out var qtyToShip))
                    continue; // Skip items not included for partial shipment

                var product = oi.Product;
                if (product.QuantityOnHand <= 0)
                    throw new InvalidOperationException($"Insufficient stock for product {product.Sku}");

                // Ship min(requested, available, ordered)
                var maxShippable = Math.Min(product.QuantityOnHand, oi.Quantity);
                var actualToShip = Math.Min(qtyToShip, maxShippable);
                if (actualToShip <= 0)
                    throw new InvalidOperationException($"Invalid ship quantity for product {product.Sku}");

                product.QuantityOnHand -= actualToShip;

                shipped.Add(new ShippedItemDto
                {
                    ProductId = product.ProductId,
                    ProductName = product.Name,
                    Sku = product.Sku,
                    QuantityRequested = qtyToShip,
                    QuantityShipped = actualToShip,
                    RemainingOnHand = product.QuantityOnHand
                });
            }

            await _context.SaveChangesAsync();

            return new ShipOrderResponseDto
            {
                OrderId = order.OrderId,
                Status = order.Status,
                ShippedDate = order.ShippedDate,
                Message = "Items deducted from inventory. Approve shipment to finalize order.",
                ShippedItems = shipped
            };
        }

        public async Task<ShipOrderResponseDto> ApproveShipmentAsync(int orderId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId);
            if (order == null)
                throw new ArgumentException("Order not found");
            if (order.Status != "Pending")
                throw new InvalidOperationException("Order is not in Pending status");

            // Mark as shipped. If you have a trigger to update shipped_date, prefer raw SQL like in InwardService.
            var affected = await _context.Database.ExecuteSqlInterpolatedAsync($@"
                UPDATE [orders]
                SET [status] = 'Shipped', [shipped_date] = GETDATE()
                WHERE [order_id] = {orderId} AND [status] = 'Pending';
            ");

            if (affected == 0)
                throw new InvalidOperationException("Order status was not updated (already shipped or not found).");

            await _context.Entry(order).ReloadAsync();

            // Build response snapshot
            var items = await _context.OrderItems
                .Include(oi => oi.Product)
                .Where(oi => oi.OrderId == orderId)
                .Select(oi => new ShippedItemDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product.Name,
                    Sku = oi.Product.Sku,
                    QuantityRequested = oi.Quantity,
                    QuantityShipped = oi.Quantity, // assuming full shipped post-approval
                    RemainingOnHand = oi.Product.QuantityOnHand
                }).ToListAsync();

            return new ShipOrderResponseDto
            {
                OrderId = order.OrderId,
                Status = order.Status,
                ShippedDate = order.ShippedDate,
                Message = "Order approved and marked as shipped.",
                ShippedItems = items
            };
        }

        public async Task<int> CreateOrderAsync(CreateOrderRequestDto request)
        {
            if (request.Items == null || request.Items.Count == 0)
                throw new ArgumentException("Order must contain at least one item");

            // Validate products exist and quantities are valid
            var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
            var products = await _context.Products
                .Where(p => productIds.Contains(p.ProductId))
                .ToDictionaryAsync(p => p.ProductId);

            if (products.Count != productIds.Count)
            {
                var missing = string.Join(", ", productIds.Where(id => !products.ContainsKey(id)));
                throw new ArgumentException($"Invalid product(s): {missing}");
            }

            var order = new Models.Order
            {
                CustomerName = request.CustomerName,
                OrderDate = DateTime.Now,
                Status = "Pending",
                OrderItems = request.Items.Select(i => new Models.OrderItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return order.OrderId;
        }
    }
}
