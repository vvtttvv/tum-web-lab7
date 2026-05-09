using Microsoft.Extensions.DependencyInjection;
using NSwag.AspNetCore;

namespace Pomodoro.API.Extensions;

public static class ApiDocumentationExtensions
{
    public static IServiceCollection AddApiDocumentation(this IServiceCollection services)
    {
        services.AddOpenApiDocument(options =>
        {
            options.Title = "Pomodoro API";
        });
        return services;
    }

    public static WebApplication UseApiDocumentation(this WebApplication app)
    {
        app.UseOpenApi();
        app.UseSwaggerUi(options =>
        {
            options.Path = "/swagger";
            options.DocumentPath = "/swagger/v1/swagger.json";
        });
        return app;
    }
}
