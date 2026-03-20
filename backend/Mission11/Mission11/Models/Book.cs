using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mission11.Models;

[Table("Books")]
public class Book
{
    [Key]
    [Column("BookID")]
    public int BookId { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Author { get; set; } = string.Empty;

    [Required]
    public string Publisher { get; set; } = string.Empty;

    [Required]
    public string ISBN { get; set; } = string.Empty;

    [Required]
    [Column("Classification")]
    public string Category { get; set; } = string.Empty;

    [Required]
    [Column("PageCount")]
    public int NumberOfPages { get; set; }

    [Required]
    public decimal Price { get; set; }
}
