namespace ProductSample.API.Features.Products.Contracts.Requests;

public record class UpdateProductRequest(
    string Name,
    string? Description,
    decimal Price,
    int Stock,
    bool IsActive,
    string? SKU,
    string? Brand,
    string? Category,
    double? WeightKg
);