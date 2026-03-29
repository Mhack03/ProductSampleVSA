using Microsoft.EntityFrameworkCore;
using ProductSample.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.Run();
