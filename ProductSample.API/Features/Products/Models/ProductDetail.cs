namespace ProductSample.API.Features.Products.Models;

public class ProductDetail
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string? SKU { get; set; }
    public string? Brand { get; set; }
    public string? Category { get; set; }
    public double WeightKg { get; set; }

    // Navigation
    public Product Product { get; set; } = null!;
}