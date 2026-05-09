using Microsoft.EntityFrameworkCore;
using Pomodoro.Domain.Entities;
using Pomodoro.Repositories.Interfaces;

namespace Pomodoro.Postgres.Repositories;

public sealed class SessionRepository : ISessionRepository
{
    private readonly AppDbContext _dbContext;

    public SessionRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<(IReadOnlyCollection<Session> Items, int Total)> GetAllAsync(
        int skip,
        int take,
        CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Sessions.AsNoTracking();
        var total = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderBy(session => session.Title)
            .Skip(skip)
            .Take(take)
            .ToListAsync(cancellationToken);

        return (items, total);
    }

    public Task<Session?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _dbContext.Sessions.AsNoTracking().FirstOrDefaultAsync(session => session.Id == id, cancellationToken);

    public async Task<Session> CreateAsync(Session session, CancellationToken cancellationToken = default)
    {
        _dbContext.Sessions.Add(session);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return session;
    }

    public async Task<bool> UpdateAsync(Session session, CancellationToken cancellationToken = default)
    {
        var exists = await _dbContext.Sessions.AnyAsync(item => item.Id == session.Id, cancellationToken);
        if (!exists)
        {
            return false;
        }

        _dbContext.Sessions.Update(session);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _dbContext.Sessions.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        _dbContext.Sessions.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
