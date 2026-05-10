namespace Pomodoro.API.DTO.Models;

public sealed class TokenResponseDto
{
    public string Token { get; init; } = string.Empty;

    public DateTimeOffset ExpiresAt { get; init; }
}
