using WarehouseAPI.Dtos.Outward;

namespace WarehouseAPI.Services
{
    public interface IOutwardService
    {
        Task<List<PendingOrderDto>> GetPendingOrdersAsync();
        Task<PendingOrderDto?> GetPendingOrderByIdAsync(int orderId);
        Task<ShipOrderResponseDto> ShipOrderAsync(int orderId); // For approval logic
        Task<ShipOrderResponseDto> MarkOrderReadyForApprovalAsync(ShipOrderRequestDto request);
        Task<int> CreateOrderAsync(CreateOrderRequestDto request);
    }
}
