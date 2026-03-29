using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace ProductSample.API.Common.Exceptions;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);

        if (exception is ValidationException validationException)
        {
            var errors = validationException.Errors
                .Select(error => new
                {
                    field = error.PropertyName,
                    message = error.ErrorMessage
                })
                .ToArray();

            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(errors, cancellationToken);

            return true;
        }

        var (status, title) = exception is IDomainException domain
            ? (domain.StatusCode, domain.Title)
            : (StatusCodes.Status500InternalServerError, "Internal Server Error");

        var problem = new ProblemDetails
        {
            Status = status,
            Title = title,
            Detail = exception.Message
        };

        context.Response.StatusCode = status;
        context.Response.ContentType = "application/problem+json";
        await context.Response.WriteAsJsonAsync(problem, cancellationToken);

        return true;
    }
}
