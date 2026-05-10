using Microsoft.Extensions.DependencyInjection;
using NSwag.AspNetCore;
using NSwag;
using NSwag.Generation.Processors.Security;

namespace Pomodoro.API.Extensions;

public static class ApiDocumentationExtensions
{
    public static IServiceCollection AddApiDocumentation(this IServiceCollection services)
    {
        services.AddOpenApiDocument(options =>
        {
            options.Title = "Pomodoro API";
            options.AddSecurity("JWT", new OpenApiSecurityScheme
            {
                Type = OpenApiSecuritySchemeType.ApiKey,
                Name = "Authorization",
                In = OpenApiSecurityApiKeyLocation.Header,
                Description = "Bearer {token}",
            });
            options.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
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
