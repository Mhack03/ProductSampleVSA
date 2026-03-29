using ProductSample.API.Common.Pagination;
using ProductSample.API.Features.Products.Contracts.Requests;
using ProductSample.API.Features.Products.Contracts.Responses;

namespace ProductSample.API.Features.Products.Services;

public interface IProductService
{
    Task<PageResult<ProductResponse>> GetAllAsync(FilterProductRequest filter, CancellationToken ct = default);
    Task<ProductResponse> GetByIdAsync(int id, CancellationToken ct = default);
    Task<ProductResponse> CreateAsync(CreateProductRequest request, CancellationToken ct = default);
    Task<ProductResponse> UpdateAsync(int id, UpdateProductRequest request, CancellationToken ct = default);
    Task DeleteAsync(int id, CancellationToken ct = default);
}
