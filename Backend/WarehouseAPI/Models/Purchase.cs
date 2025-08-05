using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseAPI.Models
{
    [Table("purchases")]
    public class Purchase
    {
        [Key]
        [Column("purchase_id")]
        public int PurchaseId { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("po_number")]
        public string PoNumber { get; set; } = string.Empty;

        [Column("supplier_id")]
        public int SupplierId { get; set; }

        [Column("order_date")]
        public DateTime OrderDate { get; set; } = DateTime.Now;

        [Column("expected_delivery")]
        public DateOnly? ExpectedDelivery { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("status")]
        public string Status { get; set; } = "Ordered";

        [Column("received_date")]
        public DateTime? ReceivedDate { get; set; }

        // Navigation properties
        [ForeignKey("SupplierId")]
        public virtual Supplier Supplier { get; set; } = null!;
        public virtual ICollection<PurchaseItem> PurchaseItems { get; set; } = new List<PurchaseItem>();
    }
}