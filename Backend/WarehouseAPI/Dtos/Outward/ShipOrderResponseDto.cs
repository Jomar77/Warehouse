namespace WarehouseAPI.Dtos.Outward
{
    public class ShipOrderResponseDto
    {
        public int OrderId { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? ShippedDate { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<ShippedItemDto> ShippedItems { get; set; } = new();
    }

    public class ShippedItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public int QuantityRequested { get; set; }
        public int QuantityShipped { get; set; }
        public int RemainingOnHand { get; set; }
    }
}
