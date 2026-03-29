using ProductSample.API.Features.Products.Contracts.Requests;
using ProductSample.API.Features.Products.Models;

namespace ProductSample.API.Features.Products.Queries;

public static class ProductSorting
{
    public static IQueryable<Product> ApplySorting(this IQueryable<Product> query,
    FilterProductRequest filter) =>
    string.IsNullOrWhiteSpace(filter.SortBy) ? query : filter.SortBy.ToLowerInvariant() switch
    {
        "price" => filter.SortDescending ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
        "stock" => filter.SortDescending ? query.OrderByDescending(p => p.Stock) : query.OrderBy(p => p.Stock),
        "createdat" => filter.SortDescending ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt),
        _ => filter.SortDescending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name)
    };
}
