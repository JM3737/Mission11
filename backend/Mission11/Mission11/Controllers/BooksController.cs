using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11.Data;

namespace Mission11.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController(BookstoreContext context) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetBooks(
        [FromQuery] int pageSize = 5,
        [FromQuery] int pageNum = 1,
        [FromQuery] string sortOrder = "asc"
    )
    {
        if (pageSize <= 0 || pageNum <= 0)
        {
            return BadRequest("pageSize and pageNum must both be greater than 0.");
        }

        var query = context.Books.AsQueryable();

        query = sortOrder.ToLowerInvariant() == "desc"
            ? query.OrderByDescending(b => b.Title)
            : query.OrderBy(b => b.Title);

        var totalNumBooks = await query.CountAsync();

        var books = await query.Skip((pageNum - 1) * pageSize).Take(pageSize).ToListAsync();

        return Ok(new
        {
            Books = books,
            TotalNumBooks = totalNumBooks
        });
    }
}
