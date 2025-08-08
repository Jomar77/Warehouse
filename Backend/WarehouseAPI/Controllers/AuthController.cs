using Microsoft.AspNetCore.Mvc;
using WarehouseAPI.Data;
using WarehouseAPI.DTOs;
using WarehouseAPI.Services;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace WarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {

        private readonly IJwtTokenService _jwtTokenService;
        private readonly WarehouseContext _context;

        public AuthController(IJwtTokenService jwtTokenService, WarehouseContext context)
        {
            _jwtTokenService = jwtTokenService;
            _context = context;
        }



        [HttpPost, Route("register")]
        public async Task<IActionResult> Register([FromBody] UserInfoDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { message = "Username and password are required." });
            }

            var exists = await _context.Users.AnyAsync(u => u.Username == dto.Username);
            if (exists)
            {
                return Conflict(new { message = "Username already exists." });
            }

            var user = new User
            {
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "staff", // default role for demo
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // If this is the very first user (user_id == 1), make them admin
            if (user.UserId == 1 && user.Role != "admin")
            {
                user.Role = "admin";
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }

            var token = _jwtTokenService.GenerateToken(user);
            var response = new LoginResponseDto
            {
                Token = token,
                Role = user.Role,
                Message = "Success"
            };

            return Ok(response);
        }

        [HttpPost, Route("login")]
        public ActionResult<LoginResponseDto> Login([FromBody] UserInfoDto request)
        {
            try
            {
                var response = _jwtTokenService.Login(request);

                if (response.Token == null)
                {
                    return Unauthorized(response);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error during login", error = ex.Message });
            }
        }
    }
}