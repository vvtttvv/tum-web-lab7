namespace Pomodoro.API.DTO.Models;

public sealed class SessionDto
{
    public Guid Id { get; init; }

    public string Title { get; init; } = string.Empty;

    public int ElapsedSeconds { get; init; }

    public int TotalSeconds { get; init; }

    public string Color { get; init; } = "#1ec8bc";

    public TimerSettingsDto TimerSettings { get; init; } = new();

    public Dictionary<string, int> DailyLog { get; init; } = new();
}
