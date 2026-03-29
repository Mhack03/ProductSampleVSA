using ProductSample.API.Common.Pagination;

namespace ProductSample.API.Features.Products.Contracts.Requests;

/// <summary>
/// Inherits PaginationQuery so Page and PageSize are always available
/// without repeating them in every filter request.
/// </summary>
public record class FilterProductRequest(
    string? Name,
    string? Category,
    string? Brand,
    decimal? MinPrice,
    decimal? MaxPrice,
    bool? IsActive,
    string SortBy = "name",
    bool SortDescending = false,
    int Page = 1,
    int PageSize = 10
) : PaginationQuery(Page, PageSize);