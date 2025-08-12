namespace WarehouseAPI.Dtos.Products
{
    public sealed class ProductDto
    {
        public int ProductId { get; set; }
        public string Sku { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string? Category { get; set; }
        public int QuantityOnHand { get; set; }
        public int ReorderLevel { get; set; }
        public int? SupplierId { get; set; }
        public string Location { get; set; } = default!;
        public SupplierSummaryDto? Supplier { get; set; }
    }

    public sealed class SupplierSummaryDto
    {
        public int SupplierId { get; set; }
        public string Name { get; set; } = default!;
    }
}