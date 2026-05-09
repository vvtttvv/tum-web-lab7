namespace Pomodoro.API.DTO.Models;

public sealed class TimerSettingsDto
{
    public int FocusMinutes { get; init; }

    public int ShortBreakMinutes { get; init; }

    public int LongBreakMinutes { get; init; }

    public int Cycles { get; init; }
}
