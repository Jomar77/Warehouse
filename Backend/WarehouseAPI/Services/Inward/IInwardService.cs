using WarehouseAPI.Dtos.Inward;

namespace WarehouseAPI.Services
{
    public interface IInwardService
    {
        Task<List<PendingPurchaseDto>> GetPendingPurchasesAsync();
        Task<PendingPurchaseDto?> GetPendingPurchaseByIdAsync(int purchaseId);
        Task<ReceivePurchaseResponseDto> ReceivePurchaseAsync(ReceivePurchaseRequestDto request);
        Task<ReceivePurchaseResponseDto> ApprovePurchaseReceiptAsync(int purchaseId);
    }
}