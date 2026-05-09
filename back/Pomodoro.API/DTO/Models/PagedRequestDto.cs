namespace Pomodoro.API.DTO.Models;

public sealed class PagedRequestDto
{
    public int? Skip { get; init; }

    public int? Take { get; init; }

    public int? Page { get; init; }

    public int? PageSize { get; init; }
}
