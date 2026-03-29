using FluentValidation;
using ProductSample.API.Common.Pagination;
using ProductSample.API.Features.Products.Contracts.Requests;

namespace ProductSample.API.Features.Products.Validators;

/// <summary>
/// Inherits PaginationQueryValidator so Page/PageSize rules
/// are never repeated across feature validators.
/// </summary>
public class FilterProductValidator : PaginationQueryValidator<FilterProductRequest>
{
    public FilterProductValidator()
    {
        RuleFor(x => x.MinPrice)
            .GreaterThanOrEqualTo(0)
            .When(x => x.MinPrice.HasValue)
            .WithMessage("MinPrice cannot be negative.");

        RuleFor(x => x.MaxPrice)
            .GreaterThanOrEqualTo(x => x.MinPrice ?? 0)
            .When(x => x.MaxPrice.HasValue)
            .WithMessage("MaxPrice must be greater than or equal to MinPrice.");
    }

}
