using System;

namespace WarehouseAPI.DTOs;

public class LoginResponseDto
{
    public string? Token { get; set; }
    public string? Role { get; set; }
    public string Message { get; set; } = default!;

}