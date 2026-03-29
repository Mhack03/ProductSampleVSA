namespace ProductSample.API.Features.Products.Contracts.Requests;

public record CreateProductRequest(
    string Name,
    string? Description,
    decimal Price,
    int Stock,
    string? SKU,
    string? Brand,
    string? Category,
    double? WeightKg
);
