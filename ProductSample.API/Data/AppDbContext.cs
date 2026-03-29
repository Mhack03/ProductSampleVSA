using System;
using Microsoft.EntityFrameworkCore;

namespace ProductSample.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
}
