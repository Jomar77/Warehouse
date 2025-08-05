using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseAPI.Models
{
    [Table("products")]
    public class Product
    {
        [Key]
        [Column("product_id")]
        public int ProductId { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("sku")]
        public string Sku { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(50)]
        [Column("category")]
        public string? Category { get; set; }

        [Column("quantity_on_hand")]
        public int QuantityOnHand { get; set; } = 0;

        [Column("reorder_level")]
        public int ReorderLevel { get; set; } = 0;

        [Column("supplier_id")]
        public int? SupplierId { get; set; }

        [MaxLength(50)]
        [Column("location")]
        public string Location { get; set; } = "Main Warehouse";

        // Navigation properties
        [ForeignKey("SupplierId")]
        public virtual Supplier? Supplier { get; set; }
        public virtual ICollection<PurchaseItem> PurchaseItems { get; set; } = new List<PurchaseItem>();
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}