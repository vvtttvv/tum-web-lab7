using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Text.Json;
using Pomodoro.Domain.Entities;

namespace Pomodoro.Postgres.Configurations;

public sealed class SessionConfiguration : IEntityTypeConfiguration<Session>
{
    public void Configure(EntityTypeBuilder<Session> builder)
    {
        builder.HasKey(session => session.Id);
        builder.Property(session => session.Title).IsRequired().HasMaxLength(200);
        builder.Property(session => session.Color).IsRequired().HasMaxLength(16);
        builder.Property(session => session.ElapsedSeconds).IsRequired();
        builder.Property(session => session.TotalSeconds).IsRequired();

        builder.OwnsOne(session => session.TimerSettings, settings =>
        {
            settings.Property(x => x.FocusMinutes).IsRequired();
            settings.Property(x => x.ShortBreakMinutes).IsRequired();
            settings.Property(x => x.LongBreakMinutes).IsRequired();
            settings.Property(x => x.Cycles).IsRequired();
        });

        var dailyLogComparer = new ValueComparer<Dictionary<DateOnly, int>>(
            (left, right) => CompareDailyLogs(left, right),
            value => HashDailyLog(value),
            value => value.ToDictionary(entry => entry.Key, entry => entry.Value));

        builder.Property(session => session.DailyLog)
            .HasColumnType("jsonb")
            .HasConversion(
                value => JsonSerializer.Serialize(
                    value.ToDictionary(
                        entry => entry.Key.ToString("yyyy-MM-dd"),
                        entry => entry.Value),
                    (JsonSerializerOptions?)null),
                value => DeserializeDailyLog(value))
            .Metadata.SetValueComparer(dailyLogComparer);
    }

    private static bool CompareDailyLogs(
        Dictionary<DateOnly, int>? left,
        Dictionary<DateOnly, int>? right)
    {
        if (ReferenceEquals(left, right))
        {
            return true;
        }

        if (left is null || right is null || left.Count != right.Count)
        {
            return false;
        }

        foreach (var (key, value) in left)
        {
            if (!right.TryGetValue(key, out var otherValue) || otherValue != value)
            {
                return false;
            }
        }

        return true;
    }

    private static int HashDailyLog(Dictionary<DateOnly, int>? value)
    {
        if (value is null)
        {
            return 0;
        }

        var hash = new HashCode();
        foreach (var entry in value.OrderBy(item => item.Key))
        {
            hash.Add(entry.Key);
            hash.Add(entry.Value);
        }

        return hash.ToHashCode();
    }

    private static Dictionary<DateOnly, int> DeserializeDailyLog(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
        {
            return new Dictionary<DateOnly, int>();
        }

        var parsed = JsonSerializer.Deserialize<Dictionary<string, int>>(json)
            ?? new Dictionary<string, int>();

        return parsed
            .Select(entry => new { Date = DateOnly.Parse(entry.Key), entry.Value })
            .ToDictionary(entry => entry.Date, entry => entry.Value);
    }
}
