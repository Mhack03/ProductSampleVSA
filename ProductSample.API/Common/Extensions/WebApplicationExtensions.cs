using Microsoft.AspNetCore.Builder;

namespace ProductSample.API.Common.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication UseProductApiPipeline(this WebApplication app)
    {
        app.UseExceptionHandler();
        app.UseHttpsRedirection();
        app.UseAuthorization();

        return app;
    }
}
