using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseAPI.Models
{
    [Table("purchase_items")]
    public class PurchaseItem
    {
        [Key]
        [Column("item_id")]
        public int ItemId { get; set; }

        [Column("purchase_id")]
        public int PurchaseId { get; set; }

        [Column("product_id")]
        public int ProductId { get; set; }

        [Column("quantity_ordered")]
        public int QuantityOrdered { get; set; }

        [Column("quantity_received")]
        public int QuantityReceived { get; set; } = 0;

        // Navigation properties
        [ForeignKey("PurchaseId")]
        public virtual Purchase Purchase { get; set; } = null!;

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;
    }
}