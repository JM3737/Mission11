using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Mission11.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    // Azure App Service sits behind a reverse proxy; allow forwarded headers from it.
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection"))
);

var app = builder.Build();

app.UseForwardedHeaders();
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();

// Root URL: helps verify the app is running on Azure (otherwise "/" had no route).
app.MapGet("/", () => Results.Text("Bookstore API is running. Try /api/books"));

app.MapControllers();

app.Run();
