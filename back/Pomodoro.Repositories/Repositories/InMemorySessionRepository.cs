using Pomodoro.Domain.Entities;
using Pomodoro.Repositories.Interfaces;

namespace Pomodoro.Repositories.Repositories;

public sealed class InMemorySessionRepository : ISessionRepository
{
    private readonly List<Session> _sessions = new();
    private readonly object _lock = new();

    public Task<(IReadOnlyCollection<Session> Items, int Total)> GetAllAsync(
        int skip,
        int take,
        CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            var total = _sessions.Count;
            var items = _sessions
                .Skip(Math.Max(0, skip))
                .Take(Math.Max(0, take))
                .Select(Clone)
                .ToList();

            return Task.FromResult(((IReadOnlyCollection<Session>)items, total));
        }
    }

    public Task<Session?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            var session = _sessions.FirstOrDefault(item => item.Id == id);
            return Task.FromResult(session is null ? null : Clone(session));
        }
    }

    public Task<Session> CreateAsync(Session session, CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            var normalized = Normalize(session);
            _sessions.Add(Clone(normalized));
            return Task.FromResult(Clone(normalized));
        }
    }

    public Task<bool> UpdateAsync(Session session, CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            var index = _sessions.FindIndex(item => item.Id == session.Id);
            if (index < 0)
            {
                return Task.FromResult(false);
            }

            _sessions[index] = Clone(session);
            return Task.FromResult(true);
        }
    }

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        lock (_lock)
        {
            var index = _sessions.FindIndex(item => item.Id == id);
            if (index < 0)
            {
                return Task.FromResult(false);
            }

            _sessions.RemoveAt(index);
            return Task.FromResult(true);
        }
    }

    private static Session Normalize(Session session)
    {
        if (session.Id == Guid.Empty)
        {
            return new Session
            {
                Id = Guid.NewGuid(),
                Title = session.Title,
                ElapsedSeconds = session.ElapsedSeconds,
                TotalSeconds = session.TotalSeconds,
                Color = session.Color,
                TimerSettings = Clone(session.TimerSettings),
                DailyLog = new Dictionary<DateOnly, int>(session.DailyLog),
            };
        }

        return session;
    }

    private static Session Clone(Session session) => new()
    {
        Id = session.Id,
        Title = session.Title,
        ElapsedSeconds = session.ElapsedSeconds,
        TotalSeconds = session.TotalSeconds,
        Color = session.Color,
        TimerSettings = Clone(session.TimerSettings),
        DailyLog = new Dictionary<DateOnly, int>(session.DailyLog),
    };

    private static TimerSettings Clone(TimerSettings settings) => new()
    {
        FocusMinutes = settings.FocusMinutes,
        ShortBreakMinutes = settings.ShortBreakMinutes,
        LongBreakMinutes = settings.LongBreakMinutes,
        Cycles = settings.Cycles,
    };
}
