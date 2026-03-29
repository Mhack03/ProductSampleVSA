using ProductSample.API.Common.Exceptions;

namespace ProductSample.API.Features.Products.Exceptions;

public class DuplicateProductException(string name)
    : Exception($"A product with the same '{name}' already exists."), IDomainException
{
    public int StatusCode => 409;

    public string Title => "Duplicate Product";
}
