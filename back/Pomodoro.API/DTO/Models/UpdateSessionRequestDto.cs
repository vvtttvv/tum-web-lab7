namespace Pomodoro.API.DTO.Models;

public sealed class UpdateSessionRequestDto
{
    public string? Title { get; init; }

    public int? ElapsedSeconds { get; init; }

    public int? TotalSeconds { get; init; }

    public string? Color { get; init; }

    public TimerSettingsDto? TimerSettings { get; init; }

    public Dictionary<string, int>? DailyLog { get; init; }
}
