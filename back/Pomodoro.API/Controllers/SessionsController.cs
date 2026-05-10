using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pomodoro.API.DTO.Mappers;
using Pomodoro.API.DTO.Models;
using Pomodoro.Services.Interfaces;

namespace Pomodoro.API.Controllers;

[ApiController]
[Route("api/sessions")]
public sealed class SessionsController : ControllerBase
{
    private const int DefaultTake = 5;
    private const int MaxTake = 10;

    private readonly ISessionService _service;

    public SessionsController(ISessionService service)
    {
        _service = service;
    }

    [Authorize(Policy = "ReadAccess")]
    [HttpGet]
    public async Task<ActionResult<PagedResponseDto<SessionDto>>> GetAll(
        [FromQuery] PagedRequestDto request,
        CancellationToken cancellationToken)
    {
        var usePage = request.Page.HasValue || request.PageSize.HasValue;
        var page = request.Page.GetValueOrDefault(1);
        page = page < 1 ? 1 : page;

        var pageSize = request.PageSize.GetValueOrDefault(request.Take ?? DefaultTake);
        pageSize = pageSize > 0 ? Math.Min(pageSize, MaxTake) : DefaultTake;

        var skip = usePage
            ? (page - 1) * pageSize
            : Math.Max(0, request.Skip.GetValueOrDefault(0));

        var take = usePage
            ? pageSize
            : request.Take.HasValue && request.Take.Value > 0
                ? Math.Min(request.Take.Value, MaxTake)
                : DefaultTake;

        var (items, total) = await _service.GetAllAsync(skip, take, cancellationToken);
        var response = new PagedResponseDto<SessionDto>
        {
            Items = items.Select(session => session.ToResponse()).ToList(),
            Skip = skip,
            Take = take,
            Total = total,
        };

        return Ok(response);
    }

    [Authorize(Policy = "ReadAccess")]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SessionDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var session = await _service.GetByIdAsync(id, cancellationToken);
        if (session is null)
        {
            return NotFound();
        }

        return Ok(session.ToResponse());
    }

    [Authorize(Policy = "WriteAccess")]
    [HttpPost]
    public async Task<ActionResult<SessionDto>> Create(
        [FromBody] CreateSessionRequestDto request,
        CancellationToken cancellationToken)
    {
        var entity = request.ToEntity();
        var created = await _service.CreateAsync(entity, cancellationToken);
        var response = created.ToResponse();

        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [Authorize(Policy = "WriteAccess")]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<SessionDto>> Update(
        Guid id,
        [FromBody] UpdateSessionRequestDto request,
        CancellationToken cancellationToken)
    {
        var existing = await _service.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return NotFound();
        }

        request.ApplyTo(existing);
        var updated = await _service.UpdateAsync(existing, cancellationToken);
        if (!updated)
        {
            return NotFound();
        }

        return Ok(existing.ToResponse());
    }

    [Authorize(Policy = "WriteAccess")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var deleted = await _service.DeleteAsync(id, cancellationToken);
        return deleted ? NoContent() : NotFound();
    }
}
