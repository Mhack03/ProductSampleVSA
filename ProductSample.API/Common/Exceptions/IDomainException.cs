namespace ProductSample.API.Common.Exceptions;

/// <summary>
/// Marker interface for domain exceptions.
/// Allows GlobalExceptionHandler to stay generic — no feature-specific switch cases needed.
/// </summary>
public interface IDomainException
{
    int StatusCode { get; }
    string Title { get; }
}
