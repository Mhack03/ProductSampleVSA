using ProductSample.API.Features.Products.Contracts.Requests;
using ProductSample.API.Features.Products.Contracts.Responses;
using ProductSample.API.Features.Products.Models;

namespace ProductSample.API.Features.Products.Mappers;

public static class ProductMapper
{
    public static ProductResponse ToResponse(this Product product) =>
        new(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.Stock,
            product.IsActive,
            product.CreatedAt,
            product.UpdatedAt,
            product.Detail?.SKU,
            product.Detail?.Brand,
            product.Detail?.Category,
            product.Detail?.WeightKg
        );

    public static Product ToEntity(this CreateProductRequest request) =>
        new()
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Stock = request.Stock,
            Detail = new ProductDetail
            {
                SKU = request.SKU,
                Brand = request.Brand,
                Category = request.Category,
                WeightKg = request.WeightKg
            }
        };

    public static void ApplyUpdate(this Product product, UpdateProductRequest request)
    {
        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.Stock = request.Stock;
        product.IsActive = request.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        if (product.Detail is not null)
        {
            product.Detail.SKU = request.SKU;
            product.Detail.Brand = request.Brand;
            product.Detail.Category = request.Category;
            product.Detail.WeightKg = request.WeightKg;
        }
    }
}
