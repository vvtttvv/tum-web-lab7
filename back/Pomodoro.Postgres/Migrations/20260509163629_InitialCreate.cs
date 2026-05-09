using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pomodoro.Postgres.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Sessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ElapsedSeconds = table.Column<int>(type: "integer", nullable: false),
                    TotalSeconds = table.Column<int>(type: "integer", nullable: false),
                    Color = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    TimerSettings_FocusMinutes = table.Column<int>(type: "integer", nullable: false),
                    TimerSettings_ShortBreakMinutes = table.Column<int>(type: "integer", nullable: false),
                    TimerSettings_LongBreakMinutes = table.Column<int>(type: "integer", nullable: false),
                    TimerSettings_Cycles = table.Column<int>(type: "integer", nullable: false),
                    DailyLog = table.Column<Dictionary<string, int>>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sessions", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Sessions");
        }
    }
}
