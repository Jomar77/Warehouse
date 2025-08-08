using System;
using WarehouseAPI.Models;
using WarehouseAPI.DTOs;

namespace WarehouseAPI.Services;


public interface IJwtTokenService
{
    public string GenerateToken(User user);

    public LoginResponseDto Login(UserInfoDto dto);
}