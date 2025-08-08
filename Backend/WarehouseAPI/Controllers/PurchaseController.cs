using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WarehouseAPI.Dtos.Purchases;
using WarehouseAPI.Services;

namespace WarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public sealed class PurchasesController : ControllerBase  // Remove [Authorize] from class level
    {
        private readonly IPurchaseService _purchaseService;

        public PurchasesController(IPurchaseService purchaseService)
        {
            _purchaseService = purchaseService;
        }

        /// <summary>
        /// Create a purchase order for a supplier
        /// </summary>
        [HttpPost]
        [Authorize(Policy = "StaffPolicy")]  // Keep only this authorization
        public async Task<ActionResult<CreatePurchaseResponseDto>> Create([FromBody] CreatePurchaseRequestDto dto, CancellationToken ct)
        {
            try
            {
                var result = await _purchaseService.CreateAsync(dto, ct);
                return CreatedAtAction(nameof(Create), new { id = result.PurchaseId }, result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating purchase", error = ex.Message });
            }
        }
    }
}