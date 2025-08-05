namespace WarehouseAPI.Dtos.Inward
{
    public class PendingPurchaseDto
    {
        public int PurchaseId { get; set; }
        public string PoNumber { get; set; } = string.Empty;
        public string SupplierName { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public DateOnly? ExpectedDelivery { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<PendingItemDto> Items { get; set; } = new List<PendingItemDto>();
    }

    public class PendingItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public int QuantityOrdered { get; set; }
        public int QuantityReceived { get; set; }
        public int QuantityPending { get; set; }
    }
}