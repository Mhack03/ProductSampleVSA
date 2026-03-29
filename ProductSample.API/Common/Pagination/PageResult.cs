namespace ProductSample.API.Common.Pagination;

/// <summary>
/// Generic paginated response wrapper used across all features.
/// Replaces feature-specific XxxListResponse classes.
/// </summary>
public record class PageResult<T>(
    IReadOnlyList<T> Items,
    int TotalCount,
    int Page,
    int PageSize
)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;

    /// <summary>
    /// Factory method for clean construction inside any service.
    /// Usage: PageResult<T>.From(items, totalCount, filter)
    /// </summary>
    public static PageResult<T> From(
        IReadOnlyList<T> items,
        int totalCount,
        PaginationQuery query) => new(items, totalCount, query.Page, query.PageSize);
}