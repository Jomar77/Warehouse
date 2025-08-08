namespace WarehouseAPI.Dtos.Purchases
{
    public sealed class CreatePurchaseResponseDto
    {
        public int PurchaseId { get; set; }
        public string PoNumber { get; set; } = default!;
        public string Status { get; set; } = default!;
        public DateTime OrderDate { get; set; }
        public DateOnly? ExpectedDelivery { get; set; }
    }
}