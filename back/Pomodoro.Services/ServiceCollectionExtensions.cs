using Microsoft.Extensions.DependencyInjection;
using Pomodoro.Services.Interfaces;
using Pomodoro.Services.Services;

namespace Pomodoro.Services;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddServicesLayer(this IServiceCollection services)
    {
        services.AddScoped<ISessionService, SessionService>();
        return services;
    }
}
