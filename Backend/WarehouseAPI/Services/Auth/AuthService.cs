using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WarehouseAPI.Models;
using WarehouseAPI.Data;
using Microsoft.IdentityModel.Tokens;
using WarehouseAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace WarehouseAPI.Services
{
    public class JwtTokenService : IJwtTokenService
    {
        private readonly IConfiguration _configuration;
        private readonly WarehouseContext _context;
        public JwtTokenService(IConfiguration configuration, WarehouseContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public LoginResponseDto Login(UserInfoDto request)
        {
            var response = new LoginResponseDto();
            var user = _context.Users.SingleOrDefault(u => u.Username == request.Username);

            if (user == null)
            {
                response.Message = "Invalide username or password";
                return response;
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                response.Message = "Invalide username or password";
                return response;
            }

            var token = GenerateToken(user);

            response.Token = token;
            response.Message = "Success";
            response.Role = user.Role;

            return response;
        }

        public string GenerateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim("role", user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                notBefore: DateTime.Now,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}