using WarehouseAPI.Dtos.Purchases;

namespace WarehouseAPI.Services
{
    public interface IPurchaseService
    {
        Task<CreatePurchaseResponseDto> CreateAsync(CreatePurchaseRequestDto dto, CancellationToken cancellationToken = default);
    }
}