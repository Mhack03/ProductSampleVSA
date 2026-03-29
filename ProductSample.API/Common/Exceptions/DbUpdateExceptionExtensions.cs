using Microsoft.EntityFrameworkCore;

namespace ProductSample.API.Common.Exceptions;

public static class DbUpdateExceptionExtensions
{
    public static bool IsUniqueKeyViolation(this DbUpdateException ex)
    {
        // SQL Server 2627 and 2601 = unique constraint violation
        var message = ex.InnerException?.Message ?? ex.Message;

        return message.Contains("2627", StringComparison.OrdinalIgnoreCase)
            || message.Contains("2601", StringComparison.OrdinalIgnoreCase)
            || message.Contains("duplicate", StringComparison.OrdinalIgnoreCase)
            || message.Contains("UNIQUE", StringComparison.OrdinalIgnoreCase);
    }
}