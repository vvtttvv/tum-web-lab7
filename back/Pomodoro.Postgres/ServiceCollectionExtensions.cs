using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Pomodoro.Postgres.Repositories;
using Pomodoro.Repositories.Interfaces;

namespace Pomodoro.Postgres;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDatabaseLayer(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");

        services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));
        services.AddPostgreSqlRepositories();
        return services;
    }

    public static IServiceCollection AddPostgreSqlRepositories(this IServiceCollection services)
    {
        services.AddScoped<ISessionRepository, SessionRepository>();
        return services;
    }
}
