using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WarehouseAPI.Dtos.Outward;
using WarehouseAPI.Services;

namespace WarehouseAPI.Controllers
{
    /// <summary>
    /// Handles order creation operations.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
   
    public class OrderController : ControllerBase
    {
        private readonly IOutwardService _outwardService;

        public OrderController(IOutwardService outwardService)
        {
            _outwardService = outwardService;
        }

        [HttpPost]
        [Authorize(Policy = "StaffPolicy")]
        public async Task<ActionResult<object>> Create([FromBody] CreateOrderRequestDto request)
        {
            if (request == null)
                return BadRequest(new { message = "Request body cannot be null." });

            try
            {
                var newId = await _outwardService.CreateOrderAsync(request);
                return CreatedAtAction("GetPendingOrder", "Outward", new { orderId = newId }, new { orderId = newId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating order", error = ex.Message });
            }
        }
    }
}