using System;
using ProductSample.API.Common.Exceptions;

namespace ProductSample.API.Features.Products.Exceptions;

public class ProductNotFoundException(int id) : Exception($"Product with ID '{id}' was not found."),
    IDomainException
{
    public int StatusCode => 404;

    public string Title => "Product Not Found";
}
