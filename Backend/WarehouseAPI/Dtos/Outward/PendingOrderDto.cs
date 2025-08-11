using System.ComponentModel.DataAnnotations;

namespace WarehouseAPI.Dtos.Outward
{
    public class PendingOrderDto
    {
        public int OrderId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<PendingOrderItemDto> Items { get; set; } = new();
    }

    public class PendingOrderItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public int QuantityOnHand { get; set; }
    }
}
