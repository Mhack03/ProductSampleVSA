# ProductSampleVSA

## Overview

`ProductSampleVSA` is a .NET 10 Web API sample demonstrating a small product catalog service using:
- ASP.NET Core 10 Minimal API host with controllers
- Entity Framework Core with SQL Server
- FluentValidation for request validation
- Global exception handling with ProblemDetails
- Swagger/OpenAPI via built-in endpoint explorer

This repository is structured as a VSA-style sample with a controller-based feature module architecture.

The primary feature set is around `Product` CRUD operations and filtered paging queries.

## Project layout

- `ProductSample.API/` — Web API host
  - `Program.cs` — app startup config, middleware, DI (uses extension helpers)
  - `Common/Extensions/ServiceCollectionExtensions.cs` — composable service registration (`AddDatabase`, `AddFeatureServices`, `AddValidation`, `AddProductApi`)
  - `Common/Extensions/WebApplicationExtensions.cs` — middleware pipeline helper (`UseProductApiPipeline`)
  - `Data/AppDbContext.cs` — EF Core context & model mapping
  - `Features/Products/` — product domain implementation
    - `Controller/ProductController.cs`
    - `Services/` (`IProductService`, `ProductService`)
    - `Models/` (`Product`, `ProductDetail`)
    - `Validators/` (create/update/filter validators)
    - `Contracts/` (requests/responses)
  - `Common/` — exception handling, extension helpers, pagination types
  - `Migrations/` — initial and generated database migration

## API Endpoints

- `GET /api/product` — list products (supports query filters + pagination)
- `GET /api/product/{id}` — get single product by ID
- `POST /api/product` — create new product
- `PUT /api/product/{id}` — update existing product
- `DELETE /api/product/{id}` — delete product

You can view OpenAPI UI at `/swagger` (dev environment) when the app is running.

## Getting started

1. Ensure SQL Server instance is available.
2. Update `ProductSample.API/appsettings.json` connection string key `DefaultConnection`.
3. Run EF Core migrations:

```powershell
cd ProductSample.API
dotnet ef database update
```

4. Build and run:

```powershell
dotnet build
dotnet run --project ProductSample.API\ProductSample.API.csproj
```

5. Browse API: `https://localhost:5001/swagger` (or printed URL)

## Public usage notice

This repository is a sample starter implementation (VSA-style controller architecture) and is not production hardened.

- No authentication or authorization is enabled.
- No secrets management is included (connection strings are in appsettings for demo only).
- No rate limiting or API throttling is configured.
- No dedicated production logging/monitoring/telemetry is configured.

Use this code as a learning base, and harden it before deploying to untrusted networks or production systems.

## Contribution guidelines

We welcome contributions and improvements. For a first contribution:
- Create a new branch (e.g., `feature/add-order-endpoints`).
- Follow the existing project structure under `Features/`.
- Add or update unit/integration tests ideally in a test project (not present by default).
- Include schema migration if EF Core model changes (`dotnet ef migrations add ...`).
- Open a PR with a clear description and testing steps.

## Notes

- Validation errors are returned as HTTP 400 with property-level messages.
- Unique `Product.Name` is enforced in DB and business logic (`DuplicateProductException`).
- Product details are related 1:1 via `ProductDetail` and cascade delete.
- Global exception middleware centralizes error handling.

## Extending the sample: add a new feature

To add a new feature (e.g. `Orders`):
1. Create a new feature folder under `Features/Orders`.
2. Add MVC controller (`Controller/OrderController.cs`) and controller routes.
3. Add service interface + implementation (`Services/IOrderService`, `Services/OrderService`) and register it in `Common/Extensions/ServiceCollectionExtensions.cs` inside `AddFeatures()`.
4. Add domain models and DbSet in `Data/AppDbContext.cs`.
5. Add request/response DTOs under `Contracts/Requests` and `Contracts/Responses`.
6. Add FluentValidation validators under `Validators/` and register them with DI in `Program.cs`.
7. Add a migration to persist schema changes (`dotnet ef migrations add OrderTable` and `dotnet ef database update`).

## Postman automated scenarios

This project includes a Postman collection at `ProductSample.API/postman/ProductSampleAPI.postman_collection.json`.

To use it:
1. Open Postman.
2. Import the collection file (`ProductSample.API/postman/ProductSampleAPI.postman_collection.json`).
3. Create an environment variable `baseUrl` (e.g. `http://localhost:5000` or `https://localhost:5001`).
4. Run the requests in order (1..11) in the collection runner.
5. The first request saves `createdProductId` automatically and later requests use it for details/update/delete.

Example requests in this collection:
- Create valid product
- Create duplicate product (expects 409)
- Create invalid product (expects 400)
- Get all products (with and without filters)
- Get by ID, update, and delete

## Testing

- No dedicated test project in this sample by default, but you can add xUnit/NUnit and test controllers, services and validation.

---

Enjoy exploring or extending this sample API for learning ASP.NET Core and EF Core patterns.
