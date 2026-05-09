namespace Pomodoro.API.DTO.Models;

public sealed class CreateSessionRequestDto
{
    public string Title { get; init; } = string.Empty;

    public int TotalSeconds { get; init; }

    public string Color { get; init; } = "#1ec8bc";

    public TimerSettingsDto TimerSettings { get; init; } = new();
}
