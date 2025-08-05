namespace WarehouseAPI.Dtos.Inward
{
    public class ReceivePurchaseResponseDto
    {
        public int PurchaseId { get; set; }
        public string PoNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? ReceivedDate { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<ReceivedItemDto> ReceivedItems { get; set; } = new List<ReceivedItemDto>();
    }

    public class ReceivedItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Sku { get; set; } = string.Empty;
        public int QuantityOrdered { get; set; }
        public int QuantityReceived { get; set; }
        public int PreviousQuantityReceived { get; set; }
    }
}