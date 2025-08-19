using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WarehouseAPI.Dtos.Outward;
using WarehouseAPI.Services;

namespace WarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OutwardController : ControllerBase
    {
        private readonly IOutwardService _outwardService;

        public OutwardController(IOutwardService outwardService)
        {
            _outwardService = outwardService;
        }

        [HttpGet, Route("pending-orders")]
        [Authorize(Policy = "StaffPolicy")]
        public async Task<ActionResult<List<PendingOrderDto>>> GetPendingOrders()
        {
            try
            {
                var orders = await _outwardService.GetPendingOrdersAsync();
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving pending orders", error = ex.Message });
            }
        }

        [HttpGet, Route("pending-orders/{orderId:int}")]
        [Authorize(Policy = "StaffPolicy")]
        public async Task<ActionResult<PendingOrderDto>> GetPendingOrder(int orderId)
        {
            try
            {
                var order = await _outwardService.GetPendingOrderByIdAsync(orderId);
                if (order == null) return NotFound(new { message = "Pending order not found" });
                return Ok(order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving order", error = ex.Message });
            }
        }

        [HttpPost, Route("ship")]
        [Authorize(Policy = "StaffPolicy")]
        public async Task<ActionResult<ShipOrderResponseDto>> Ship([FromBody] ShipOrderRequestDto request)
        {
            try
            {
                var result = await _outwardService.ShipOrderAsync(request);
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
                return StatusCode(500, new { message = "Error shipping order", error = ex.Message });
            }
        }

        [HttpPost, Route("approve/{orderId:int}")]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<ShipOrderResponseDto>> Approve(int orderId)
        {
            try
            {
                var result = await _outwardService.ApproveShipmentAsync(orderId);
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
                return StatusCode(500, new { message = "Error approving shipment", error = ex.Message });
            }
        }

      
    }
}
