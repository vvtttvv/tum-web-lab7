namespace Pomodoro.API.DTO.Models;

public sealed class PagedResponseDto<T>
{
    public IReadOnlyCollection<T> Items { get; init; } = Array.Empty<T>();

    public int Skip { get; init; }

    public int Take { get; init; }

    public int Total { get; init; }
}
