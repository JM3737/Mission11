using System.ComponentModel.DataAnnotations;

namespace Mission11.Models;

/// <summary>
/// Fields sent from the client when creating or updating a book.
/// </summary>
public class BookWriteDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Author { get; set; } = string.Empty;

    [Required]
    public string Publisher { get; set; } = string.Empty;

    [Required]
    public string Isbn { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int NumberOfPages { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }
}
