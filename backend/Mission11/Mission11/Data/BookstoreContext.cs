using Microsoft.EntityFrameworkCore;
using Mission11.Models;

namespace Mission11.Data;

public class BookstoreContext(DbContextOptions<BookstoreContext> options) : DbContext(options)
{
    public DbSet<Book> Books => Set<Book>();
}
