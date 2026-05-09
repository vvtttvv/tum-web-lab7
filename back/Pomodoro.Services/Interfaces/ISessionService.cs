using Pomodoro.Domain.Entities;

namespace Pomodoro.Services.Interfaces;

public interface ISessionService
{
    Task<(IReadOnlyCollection<Session> Items, int Total)> GetAllAsync(
        int skip,
        int take,
        CancellationToken cancellationToken = default);

    Task<Session?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<Session> CreateAsync(Session session, CancellationToken cancellationToken = default);

    Task<bool> UpdateAsync(Session session, CancellationToken cancellationToken = default);

    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
