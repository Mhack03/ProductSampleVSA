using Microsoft.EntityFrameworkCore;
using ProductSample.API.Features.Products.Models;

namespace ProductSample.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductDetail> ProductDetails => Set<ProductDetail>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
            entity.HasIndex(p => p.Name).IsUnique();
            entity.Property(p => p.Price).HasColumnType("decimal(18,2)");
            entity.HasOne(p => p.Detail)
                  .WithOne(d => d.Product)
                  .HasForeignKey<ProductDetail>(d => d.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
