using ProductSample.API.Features.Products.Contracts.Requests;
using ProductSample.API.Features.Products.Models;

namespace ProductSample.API.Features.Products.Queries;

public static class ProductQueryExtensions
{
    public static IQueryable<Product> ApplyFilter(this IQueryable<Product> query,
    FilterProductRequest filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Name))
            query = query.Where(p => p.Name.Contains(filter.Name));

        if (!string.IsNullOrWhiteSpace(filter.Category))
            query = query.Where(p => p.Detail != null && p.Detail.Category == filter.Category);

        if (!string.IsNullOrWhiteSpace(filter.Brand))
            query = query.Where(p => p.Detail != null && p.Detail.Brand == filter.Brand);

        if (filter.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= filter.MaxPrice.Value);

        if (filter.MinPrice.HasValue)
            query = query.Where(p => p.Price >= filter.MinPrice.Value);

        if (filter.IsActive.HasValue)
            query = query.Where(p => p.IsActive == filter.IsActive.Value);

        return query;
    }
}
