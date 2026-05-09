namespace Pomodoro.Domain.Entities;

public sealed class TimerSettings
{
    public int FocusMinutes { get; init; }

    public int ShortBreakMinutes { get; init; }

    public int LongBreakMinutes { get; init; }

    public int Cycles { get; init; }
}
