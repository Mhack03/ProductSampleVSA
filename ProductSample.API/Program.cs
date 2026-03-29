using ProductSample.API.Common.Exceptions;
using ProductSample.API.Common.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddFeatureServices();
builder.Services.AddValidation();
builder.Services.AddProductApi();

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseProductApiPipeline();
app.MapControllers();

app.Run();
