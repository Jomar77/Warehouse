namespace WarehouseAPI.Dtos.Inward
{
    public class ReceivePurchaseRequestDto
    {
        public int PurchaseId { get; set; }
        public List<ReceiveItemDto> Items { get; set; } = new List<ReceiveItemDto>();
    }

    public class ReceiveItemDto
    {
        public int ProductId { get; set; }
        public int QuantityReceived { get; set; }
    }
}