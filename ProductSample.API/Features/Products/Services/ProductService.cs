using Microsoft.EntityFrameworkCore;
using ProductSample.API.Common.Exceptions;
using ProductSample.API.Common.Extensions;
using ProductSample.API.Common.Pagination;
using ProductSample.API.Data;
using ProductSample.API.Features.Products.Contracts.Requests;
using ProductSample.API.Features.Products.Contracts.Responses;
using ProductSample.API.Features.Products.Exceptions;
using ProductSample.API.Features.Products.Mappers;
using ProductSample.API.Features.Products.Queries;

namespace ProductSample.API.Features.Products.Services;

public class ProductService(AppDbContext dbContext) : IProductService
{
    private static string NormalizeName(string name) => name.Trim();

    public async Task<ProductResponse> CreateAsync(CreateProductRequest request, CancellationToken ct = default)
    {
        var normalized = NormalizeName(request.Name);

        var exist = await dbContext.Products
            .AsNoTracking()
            .AnyAsync(p => p.Name != null && p.Name.Trim().ToLower() == normalized.ToLower(), ct);

        if (exist) throw new DuplicateProductException(request.Name);

        var product = request.ToEntity();
        product.Name = normalized; // preserve casing except trim

        dbContext.Products.Add(product);

        try
        {
            await dbContext.SaveChangesAsync(ct);
        }
        catch (DbUpdateException ex) when (ex.IsUniqueKeyViolation())
        {
            throw new DuplicateProductException(request.Name);
        }

        return product.ToResponse();
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var product = await dbContext.Products
            .FirstOrDefaultAsync(p => p.Id == id, ct)
            ?? throw new ProductNotFoundException(id);

        dbContext.Remove(product);
        await dbContext.SaveChangesAsync(ct);
    }

    public async Task<PageResult<ProductResponse>> GetAllAsync(FilterProductRequest filter, CancellationToken ct = default)
    {
        var query = dbContext.Products
            .Include(p => p.Detail)
            .AsNoTracking()
            .ApplyFilter(filter)
            .ApplySorting(filter);

        var totalCount = await query.CountAsync(ct);

        var items = await query
            .ApplyPaging(filter)
            .ToListAsync(ct);

        var response = items.Select(p => p.ToResponse()).ToList();

        return PageResult<ProductResponse>.From(response, totalCount, filter);
    }

    public async Task<ProductResponse> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var product = await dbContext.Products
            .Include(p => p.Detail)
            .FirstOrDefaultAsync(p => p.Id == id, ct)
            ?? throw new ProductNotFoundException(id);

        return product.ToResponse();
    }

    public async Task<ProductResponse> UpdateAsync(int id, UpdateProductRequest request, CancellationToken ct = default)
    {
        var product = await dbContext.Products
            .Include(p => p.Detail)
            .FirstOrDefaultAsync(p => p.Id == id, ct)
            ?? throw new ProductNotFoundException(id);

        var normalized = NormalizeName(request.Name);

        var exist = await dbContext.Products
            .AsNoTracking()
            .AnyAsync(p => p.Id != id && p.Name != null && p.Name.Trim().ToLower() == normalized.ToLower(), ct);

        if (exist) throw new DuplicateProductException(request.Name);

        var updateRequest = request with { Name = normalized };

        product.ApplyUpdate(updateRequest);

        try
        {
            await dbContext.SaveChangesAsync(ct);
        }
        catch (DbUpdateException ex) when (ex.IsUniqueKeyViolation())
        {
            throw new DuplicateProductException(request.Name);
        }

        return product.ToResponse();
    }
}
