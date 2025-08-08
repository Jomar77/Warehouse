namespace WarehouseAPI.Dtos.Purchases
{
    public sealed class CreatePurchaseRequestDto
    {
        public int SupplierId { get; set; }
        public DateOnly? ExpectedDelivery { get; set; }
        public List<CreatePurchaseItemDto> Items { get; set; } = new();
    }

    public sealed class CreatePurchaseItemDto
    {
        public int ProductId { get; set; }
        public int QuantityOrdered { get; set; }
    }
}