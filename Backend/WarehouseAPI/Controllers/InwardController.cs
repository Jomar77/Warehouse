using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WarehouseAPI.Dtos.Inward;
using WarehouseAPI.Services;

namespace WarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication for all endpoints
    public class InwardController : ControllerBase
    {
        private readonly IInwardService _inwardService;

        public InwardController(IInwardService inwardService)
        {
            _inwardService = inwardService;
        }

        /// <summary>
        /// Get all pending purchase orders that can be received
        /// </summary>
        [HttpGet("pending-purchases")]
        [Authorize(Roles = "admin,staff")] // Both admin and staff can view
        public async Task<ActionResult<List<PendingPurchaseDto>>> GetPendingPurchases()
        {
            try
            {
                var pendingPurchases = await _inwardService.GetPendingPurchasesAsync();
                return Ok(pendingPurchases);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving pending purchases", error = ex.Message });
            }
        }

        /// <summary>
        /// Get a specific pending purchase order by ID
        /// </summary>
        [HttpGet("pending-purchases/{purchaseId:int}")]
        [Authorize(Roles = "admin,staff")]
        public async Task<ActionResult<PendingPurchaseDto>> GetPendingPurchase(int purchaseId)
        {
            try
            {
                var purchase = await _inwardService.GetPendingPurchaseByIdAsync(purchaseId);
                
                if (purchase == null)
                    return NotFound(new { message = "Pending purchase not found" });

                return Ok(purchase);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving purchase", error = ex.Message });
            }
        }

        /// <summary>
        /// Receive items from a purchase order (partial receiving)
        /// </summary>
        [HttpPost("receive")]
        [Authorize(Roles = "admin,staff")]
        public async Task<ActionResult<ReceivePurchaseResponseDto>> ReceivePurchase([FromBody] ReceivePurchaseRequestDto request)
        {
            try
            {
                var result = await _inwardService.ReceivePurchaseAsync(request);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error receiving purchase", error = ex.Message });
            }
        }

        /// <summary>
        /// Approve and finalize purchase receipt (triggers inventory update)
        /// </summary>
        [HttpPost("approve/{purchaseId:int}")]
        [Authorize(Roles = "admin")] // Only admin can approve
        public async Task<ActionResult<ReceivePurchaseResponseDto>> ApprovePurchaseReceipt(int purchaseId)
        {
            try
            {
                var result = await _inwardService.ApprovePurchaseReceiptAsync(purchaseId);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error approving purchase receipt", error = ex.Message });
            }
        }
    }
}