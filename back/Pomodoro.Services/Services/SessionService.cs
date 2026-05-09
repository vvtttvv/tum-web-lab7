using Pomodoro.Domain.Entities;
using Pomodoro.Repositories.Interfaces;
using Pomodoro.Services.Interfaces;

namespace Pomodoro.Services.Services;

public sealed class SessionService : ISessionService, ISessionRepository
{
    private const int DefaultTake = 20;
    private const int MaxTake = 200;

    private readonly ISessionRepository _repository;

    public SessionService(ISessionRepository repository)
    {
        _repository = repository;
    }

    public Task<(IReadOnlyCollection<Session> Items, int Total)> GetAllAsync(
        int skip,
        int take,
        CancellationToken cancellationToken = default)
    {
        var safeSkip = Math.Max(0, skip);
        var safeTake = Math.Clamp(take <= 0 ? DefaultTake : take, 1, MaxTake);

        return _repository.GetAllAsync(safeSkip, safeTake, cancellationToken);
    }

    public Task<Session?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _repository.GetByIdAsync(id, cancellationToken);

    public Task<Session> CreateAsync(Session session, CancellationToken cancellationToken = default) =>
        _repository.CreateAsync(session, cancellationToken);

    public Task<bool> UpdateAsync(Session session, CancellationToken cancellationToken = default) =>
        _repository.UpdateAsync(session, cancellationToken);

    public Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default) =>
        _repository.DeleteAsync(id, cancellationToken);
}
