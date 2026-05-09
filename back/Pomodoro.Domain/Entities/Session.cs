namespace Pomodoro.Domain.Entities;

public sealed class Session
{
    public Guid Id { get; init; }

    public string Title { get; set; } = string.Empty;

    public int ElapsedSeconds { get; set; }

    public int TotalSeconds { get; set; }

    public string Color { get; set; } = "#1ec8bc";

    public TimerSettings TimerSettings { get; set; } = new();

    public Dictionary<DateOnly, int> DailyLog { get; set; } = new();
}
