using WarehouseAPI.Dtos.Outward;

namespace WarehouseAPI.Services
{
    public interface IOutwardService
    {
        Task<List<PendingOrderDto>> GetPendingOrdersAsync();
        Task<PendingOrderDto?> GetPendingOrderByIdAsync(int orderId);
        Task<ShipOrderResponseDto> ShipOrderAsync(ShipOrderRequestDto request);
        Task<ShipOrderResponseDto> ApproveShipmentAsync(int orderId);
        Task<int> CreateOrderAsync(CreateOrderRequestDto request);
    }
}
