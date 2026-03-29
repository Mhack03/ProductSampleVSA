namespace ProductSample.API.Common.Pagination;

/// Base record for all filter/query requests.
/// Inherit this in every FilterXxxRequest so pagination is always consistent.
/// </summary>
public abstract record PaginationQuery(
    int Page = 1,
    int PageSize = 10
);
