using Pomodoro.API.Extensions;
using Pomodoro.Postgres;
using Pomodoro.Services;

var builder = WebApplication.CreateBuilder(args);

var envPath = FindEnvPath();
if (envPath is not null)
{
    LoadEnvFile(envPath);
}
builder.Configuration.AddEnvironmentVariables();

builder.Services.AddControllers();
builder.Services.AddApiDocumentation();
builder.Services.AddServicesLayer();
builder.Services.AddDatabaseLayer(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseApiDocumentation();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();

static void LoadEnvFile(string path)
{
    if (!File.Exists(path))
    {
        return;
    }

    foreach (var line in File.ReadAllLines(path))
    {
        var trimmed = line.Trim();
        if (string.IsNullOrWhiteSpace(trimmed) || trimmed.StartsWith('#'))
        {
            continue;
        }

        var separatorIndex = trimmed.IndexOf('=');
        if (separatorIndex <= 0)
        {
            continue;
        }

        var key = trimmed[..separatorIndex].Trim();
        var value = trimmed[(separatorIndex + 1)..].Trim();
        Environment.SetEnvironmentVariable(key, value);
    }
}

static string? FindEnvPath()
{
    var directory = new DirectoryInfo(AppContext.BaseDirectory);
    while (directory is not null)
    {
        var candidate = Path.Combine(directory.FullName, ".env");
        if (File.Exists(candidate))
        {
            return candidate;
        }

        directory = directory.Parent;
    }

    return null;
}