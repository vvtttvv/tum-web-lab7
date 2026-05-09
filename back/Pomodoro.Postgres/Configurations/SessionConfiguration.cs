using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
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

        builder.Property(session => session.DailyLog)
            .HasColumnType("jsonb")
            .HasConversion(
                value => value.ToDictionary(
                    entry => entry.Key.ToString("yyyy-MM-dd"),
                    entry => entry.Value),
                value => value
                    .Select(entry => new { Date = DateOnly.Parse(entry.Key), entry.Value })
                    .ToDictionary(entry => entry.Date, entry => entry.Value));
    }
}
