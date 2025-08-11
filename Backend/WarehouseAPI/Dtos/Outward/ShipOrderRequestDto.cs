using System.ComponentModel.DataAnnotations;

namespace WarehouseAPI.Dtos.Outward
{
    public class ShipOrderRequestDto
    {
        [Required]
        public int OrderId { get; set; }

        // Allow partial shipping; if null or empty, ship full order
        public List<ShipOrderItemDto>? Items { get; set; }
    }

    public class ShipOrderItemDto
    {
        [Required]
        public int ProductId { get; set; }

        [Range(1, int.MaxValue)]
        public int QuantityToShip { get; set; }
    }
}
