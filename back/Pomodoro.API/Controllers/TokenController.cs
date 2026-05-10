using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Pomodoro.API.DTO.Models;

namespace Pomodoro.API.Controllers;

[ApiController]
[Route("token")]
public sealed class TokenController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public TokenController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost]
    public ActionResult<TokenResponseDto> CreateToken([FromBody] TokenRequestDto request)
    {
        var jwtKey = _configuration["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            return Problem("JWT key is not configured.", statusCode: StatusCodes.Status500InternalServerError);
        }

        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];
        var expiresMinutes = ResolveExpiresMinutes();

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, request.Subject ?? Guid.NewGuid().ToString()),
        };

        foreach (var permission in request.Permissions.Distinct(StringComparer.OrdinalIgnoreCase))
        {
            claims.Add(new Claim("permissions", permission));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiresAt = DateTimeOffset.UtcNow.AddMinutes(expiresMinutes);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt.UtcDateTime,
            signingCredentials: creds);

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        return Ok(new TokenResponseDto
        {
            Token = tokenString,
            ExpiresAt = expiresAt,
        });
    }

    private int ResolveExpiresMinutes()
    {
        var raw = _configuration["Jwt:ExpiresMinutes"];
        return int.TryParse(raw, out var value) && value > 0 ? value : 1;
    }
}
