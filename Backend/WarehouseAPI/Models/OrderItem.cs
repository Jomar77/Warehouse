using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseAPI.Models
{
    [Table("order_items")]
    public class OrderItem
    {
        [Key]
        [Column("item_id")]
        public int ItemId { get; set; }

        [Column("order_id")]
        public int OrderId { get; set; }

        [Column("product_id")]
        public int ProductId { get; set; }


        [Column("quantity_ordered")]
        public int QuantityOrdered { get; set; }

        [Column("quantity_sent")]
        public int? QuantitySent { get; set; }

        // Navigation properties
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;

        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;
    }
}