using FluentValidation;

namespace ProductSample.API.Common.Pagination;

/// <summary>
/// Base validator for pagination rules.
/// Inherit in every FilterXxxValidator so Page/PageSize rules are never duplicated.
/// </summary>
public abstract class PaginationQueryValidator<T> : AbstractValidator<T> where T : PaginationQuery
{
    protected PaginationQueryValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThan(0)
            .WithMessage("Page must be greater than zero.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 100)
            .WithMessage("Page Size must be between  1 and 100.");
    }
}
