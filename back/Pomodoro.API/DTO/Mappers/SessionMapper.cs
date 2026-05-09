using Pomodoro.API.DTO.Models;
using Pomodoro.Domain.Entities;

namespace Pomodoro.API.DTO.Mappers;

public static class SessionMapper
{
    public static Session ToEntity(this CreateSessionRequestDto request) => new()
    {
        Id = Guid.NewGuid(),
        Title = request.Title,
        TotalSeconds = request.TotalSeconds,
        Color = request.Color,
        TimerSettings = request.TimerSettings.ToEntity(),
        DailyLog = new Dictionary<DateOnly, int>(),
    };

    public static Session ToEntity(this UpdateSessionRequestDto request) => new()
    {
        Title = request.Title ?? string.Empty,
        ElapsedSeconds = request.ElapsedSeconds ?? 0,
        TotalSeconds = request.TotalSeconds ?? 0,
        Color = request.Color ?? "#1ec8bc",
        TimerSettings = request.TimerSettings?.ToEntity() ?? new TimerSettings(),
        DailyLog = request.DailyLog?.ToDomainDailyLog() ?? new Dictionary<DateOnly, int>(),
    };

    public static void ApplyTo(this UpdateSessionRequestDto request, Session session)
    {
        if (request.Title is not null)
        {
            session.Title = request.Title;
        }

        if (request.ElapsedSeconds.HasValue)
        {
            session.ElapsedSeconds = request.ElapsedSeconds.Value;
        }

        if (request.TotalSeconds.HasValue)
        {
            session.TotalSeconds = request.TotalSeconds.Value;
        }

        if (request.Color is not null)
        {
            session.Color = request.Color;
        }

        if (request.TimerSettings is not null)
        {
            session.TimerSettings = request.TimerSettings.ToEntity();
        }

        if (request.DailyLog is not null)
        {
            session.DailyLog = request.DailyLog.ToDomainDailyLog();
        }
    }

    public static SessionDto ToResponse(this Session session) => new()
    {
        Id = session.Id,
        Title = session.Title,
        ElapsedSeconds = session.ElapsedSeconds,
        TotalSeconds = session.TotalSeconds,
        Color = session.Color,
        TimerSettings = session.TimerSettings.ToDto(),
        DailyLog = session.DailyLog.ToResponseDailyLog(),
    };

    public static TimerSettings ToEntity(this TimerSettingsDto dto) => new()
    {
        FocusMinutes = dto.FocusMinutes,
        ShortBreakMinutes = dto.ShortBreakMinutes,
        LongBreakMinutes = dto.LongBreakMinutes,
        Cycles = dto.Cycles,
    };

    public static TimerSettingsDto ToDto(this TimerSettings settings) => new()
    {
        FocusMinutes = settings.FocusMinutes,
        ShortBreakMinutes = settings.ShortBreakMinutes,
        LongBreakMinutes = settings.LongBreakMinutes,
        Cycles = settings.Cycles,
    };

    public static Dictionary<string, int> ToResponseDailyLog(this Dictionary<DateOnly, int> dailyLog) =>
        dailyLog.ToDictionary(entry => entry.Key.ToString("yyyy-MM-dd"), entry => entry.Value);

    public static Dictionary<DateOnly, int> ToDomainDailyLog(this Dictionary<string, int> dailyLog) =>
        dailyLog
            .Select(entry => new { Date = DateOnly.Parse(entry.Key), entry.Value })
            .ToDictionary(entry => entry.Date, entry => entry.Value);
}
