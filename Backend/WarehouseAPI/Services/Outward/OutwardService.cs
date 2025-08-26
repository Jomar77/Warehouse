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
                .Where(o => o.Status == "Pending" || o.Status == "Shipped") // Include both since trigger can auto-update to Shipped
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
                        QuantityOrdered = oi.QuantityOrdered,
                        QuantitySent = oi.QuantitySent,
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
                        QuantityOrdered = oi.QuantityOrdered,
                        QuantitySent = oi.QuantitySent,
                        QuantityOnHand = oi.Product.QuantityOnHand
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return order;
        }

        // ShipOrderAsync - simplified since trigger handles status updates automatically
        public async Task<ShipOrderResponseDto> ShipOrderAsync(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (order == null)
                throw new ArgumentException("Order not found");
            if (order.Status != "Pending")
                throw new InvalidOperationException("Order must be in Pending status to approve");

            // Check if all items are fully shipped
            var allItemsFullyShipped = order.OrderItems.All(oi => 
                (oi.QuantitySent ?? 0) >= oi.QuantityOrdered);

            if (!allItemsFullyShipped)
                throw new InvalidOperationException("Cannot approve order: not all items are fully shipped");

            // The order should already be "Shipped" due to the database trigger
            // This method is mainly for final approval confirmation
            var shippedItems = order.OrderItems.Select(oi => new ShippedItemDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.Product.Name,
                Sku = oi.Product.Sku,
                QuantityOrdered = oi.QuantityOrdered,
                QuantitySent = oi.QuantitySent ?? 0,
                RemainingOnHand = oi.Product.QuantityOnHand
            }).ToList();

            return new ShipOrderResponseDto
            {
                OrderId = order.OrderId,
                Status = order.Status,
                ShippedDate = order.ShippedDate,
                Message = "Order has been approved. All items were fully shipped.",
                ShippedItems = shippedItems
            };
        }

        // MarkOrderReadyForApprovalAsync: uses stored procedure for atomic operations
        public async Task<ShipOrderResponseDto> MarkOrderReadyForApprovalAsync(ShipOrderRequestDto request)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.OrderId == request.OrderId);

            if (order == null)
                throw new ArgumentException("Order not found");
            if (order.Status != "Pending")
                throw new InvalidOperationException("Order is not in Pending status");

            try
            {
                // Use stored procedure for each item to ship
                if (request.Items != null && request.Items.Count > 0)
                {
                    // Ship specific items with specified quantities
                    foreach (var item in request.Items)
                    {
                        await _context.Database.ExecuteSqlInterpolatedAsync($@"
                            EXEC sp_ProcessShipment 
                                @OrderId = {request.OrderId}, 
                                @ProductId = {item.ProductId}, 
                                @QuantityToShip = {item.QuantityToShip}
                        ");
                    }
                }
                else
                {
                    // Ship all remaining quantities for all items in the order
                    foreach (var orderItem in order.OrderItems)
                    {
                        var remainingToShip = orderItem.QuantityOrdered - (orderItem.QuantitySent ?? 0);
                        if (remainingToShip > 0)
                        {
                            await _context.Database.ExecuteSqlInterpolatedAsync($@"
                                EXEC sp_ProcessShipment 
                                    @OrderId = {request.OrderId}, 
                                    @ProductId = {orderItem.ProductId}, 
                                    @QuantityToShip = {remainingToShip}
                            ");
                        }
                    }
                }

                // Reload the order to get updated values (including status updated by trigger)
                await _context.Entry(order).ReloadAsync();
                foreach (var oi in order.OrderItems)
                {
                    await _context.Entry(oi).ReloadAsync();
                    await _context.Entry(oi.Product).ReloadAsync();
                }

                var items = order.OrderItems.Select(oi => new ShippedItemDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product.Name,
                    Sku = oi.Product.Sku,
                    QuantityOrdered = oi.QuantityOrdered,
                    QuantitySent = oi.QuantitySent ?? 0,
                    RemainingOnHand = oi.Product.QuantityOnHand
                }).ToList();

                var message = order.Status == "Shipped" 
                    ? "Order fully shipped and automatically approved by system." 
                    : "Partial shipment processed successfully. Order remains pending until fully shipped.";

                return new ShipOrderResponseDto
                {
                    OrderId = order.OrderId,
                    Status = order.Status,
                    ShippedDate = order.ShippedDate,
                    Message = message,
                    ShippedItems = items
                };
            }
            catch (Microsoft.Data.SqlClient.SqlException ex) when (ex.Number == 50001)
            {
                throw new InvalidOperationException("Insufficient stock to ship this order. Please check product availability.");
            }
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
                    QuantityOrdered = i.QuantityOrdered
                }).ToList()
            };

            _context.Orders.Add(order);
            
            // Use raw SQL to avoid trigger conflicts for order creation
            try
            {
                await _context.SaveChangesAsync();
                return order.OrderId;
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException ex) when (ex.InnerException?.Message?.Contains("triggers") == true)
            {
                // If triggers cause issues with order creation too, we'd need to insert via raw SQL
                // For now, let's see if this affects order creation
                throw new InvalidOperationException("Database trigger conflict during order creation", ex);
            }
        }
    }
}
