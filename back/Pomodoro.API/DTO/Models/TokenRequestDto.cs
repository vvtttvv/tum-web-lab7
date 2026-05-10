namespace Pomodoro.API.DTO.Models;

public sealed class TokenRequestDto
{
    public string? Subject { get; init; }

    public IReadOnlyCollection<string> Permissions { get; init; } = Array.Empty<string>();
}
