using ProductSample.API.Common.Pagination;

namespace ProductSample.API.Common.Extensions;

public static class QueryableExtensions
{
    /// <summary>
    /// Applies Skip/Take based on the shared PaginationQuery.
    /// Use this in every service to keep paging logic consistent.
    /// </summary>
    public static IQueryable<T> ApplyPaging<T>(
        this IQueryable<T> query,
        PaginationQuery pagination) => 
        query
            .Skip((pagination.Page -1) * pagination.PageSize)
            .Take(pagination.PageSize);
}
