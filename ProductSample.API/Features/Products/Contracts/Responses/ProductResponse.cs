namespace ProductSample.API.Features.Products.Contracts.Responses;

public record class ProductResponse(
    int Id,
    string Name,
    string? Description,
    decimal Price,
    int Stock,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    string? SKU,
    string? Brand,
    string? Category,
    double? WeightKg
);
