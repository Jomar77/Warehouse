namespace WarehouseAPI.Dtos.Products
{
    public class ReorderAlertDto
    {
        public int ProductId { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int QuantityOnHand { get; set; }
        public int ReorderLevel { get; set; }
        public int ShortageAmount { get; set; }
    }
}
