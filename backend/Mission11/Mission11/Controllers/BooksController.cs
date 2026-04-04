using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mission11.Data;
using Mission11.Models;

namespace Mission11.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController(BookstoreContext context) : ControllerBase
{
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await context.Books
            .Select(b => b.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }

    /// <summary>
    /// All books (for the admin page).
    /// </summary>
    [HttpGet("all")]
    public async Task<IActionResult> GetAllBooks()
    {
        var books = await context.Books.OrderBy(b => b.Title).ToListAsync();
        return Ok(books);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetBook(int id)
    {
        var book = await context.Books.FindAsync(id);
        return book == null ? NotFound() : Ok(book);
    }

    [HttpGet]
    public async Task<IActionResult> GetBooks(
        [FromQuery] int pageSize = 5,
        [FromQuery] int pageNum = 1,
        [FromQuery] string sortOrder = "asc",
        [FromQuery] string? category = null
    )
    {
        if (pageSize <= 0 || pageNum <= 0)
        {
            return BadRequest("pageSize and pageNum must both be greater than 0.");
        }

        var query = context.Books.AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(b => b.Category == category);
        }

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

    [HttpPost]
    public async Task<IActionResult> CreateBook([FromBody] BookWriteDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var book = new Book
        {
            Title = dto.Title,
            Author = dto.Author,
            Publisher = dto.Publisher,
            ISBN = dto.Isbn,
            Category = dto.Category,
            NumberOfPages = dto.NumberOfPages,
            Price = dto.Price
        };

        context.Books.Add(book);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBook), new { id = book.BookId }, book);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] BookWriteDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var book = await context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound();
        }

        book.Title = dto.Title;
        book.Author = dto.Author;
        book.Publisher = dto.Publisher;
        book.ISBN = dto.Isbn;
        book.Category = dto.Category;
        book.NumberOfPages = dto.NumberOfPages;
        book.Price = dto.Price;

        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await context.Books.FindAsync(id);
        if (book == null)
        {
            return NotFound();
        }

        context.Books.Remove(book);
        await context.SaveChangesAsync();
        return NoContent();
    }
}
