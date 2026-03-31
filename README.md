# ProductSampleVSA

## Overview

`ProductSampleVSA` is a .NET 10 Web API sample, built as a modular, maintainable product catalog service.

Key architecture details:
- ASP.NET Core 10 Minimal API host + MVC controllers (`MapControllers`).
- EF Core with SQL Server migrations (`AppDbContext`, `Migrations`).
- FluentValidation (create/update/filter product requests).
- Global exception handling with custom `GlobalExceptionHandler` and RFC 7807 Problem Details.
- Swagger/OpenAPI in development (`AddOpenApi`, `MapOpenApi`).

This codebase uses a clear per-feature module layout under `Features/Products` with service abstraction, validators, mapping and DTO contracts.

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
3. Add service interface + implementation (`Services/IOrderService`, `Services/OrderService`) and register it in `Common/Extensions/ServiceCollectionExtensions.cs` inside `AddFeatureServices()`.
4. Add domain models and DbSet in `Data/AppDbContext.cs`.
5. Add request/response DTOs under `Contracts/Requests` and `Contracts/Responses`.
6. Add FluentValidation validators under `Validators/`, then call `builder.Services.AddValidation()` in `Program.cs` (as implemented in `ProductSample.API/Program.cs`).
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

## Web automation with Playwright

From the `product-client` folder:

1. Install dependencies:
  - `npm install`
  - `npx playwright install`
2. Run tests (examples):
  - `npm run test:e2e` — run headless tests
  - `npm run test:e2e:headed` — interactive/headed run
  - `npm run test:e2e:generate-report` — run tests and generate HTML report
  - `npm run test:e2e:with-report` — run tests then open the HTML report (PowerShell-friendly npm script)
  - `npm run test:e2e:headed:with-report` — headed run and open report

PowerShell note: `&&` is not supported in all PowerShell versions. Use this pattern to run tests then open the report only if tests succeed:

```powershell
npm run test:e2e:generate-report
if ($LASTEXITCODE -eq 0) { npm run test:e2e:report }
```

This adds a Playwright setup at `product-client/playwright.config.ts` and tests in `product-client/e2e/product.spec.ts`.

---

## Learning & customizing Playwright tests (for this project)

This project includes a small set of Playwright E2E tests intended for learning how the UI and API interact. The following quick guide helps you run the API, run the client, run tests, and tweak test speed/concurrency so you can observe or accelerate the flows.

1. Start the backend API (in one terminal):

```powershell
cd ProductSample.API
dotnet build
dotnet run --project ProductSample.API.csproj
# API will listen on the port configured in appsettings.json (e.g. http://localhost:5012)
```

2. (Optional) Start the client dev server manually (Playwright will start it automatically when using the `webServer` option, but you can run it separately if you prefer):

```powershell
cd product-client
npm install
npm run dev
```

3. Run tests (examples) from `product-client`:

- Headless, fast run (parallel):

```powershell
npm run test:e2e
```

- Headed — human-observable (runs tests in a visible browser):

```powershell
npm run test:e2e:headed
```

- Generate and view HTML report (PowerShell-safe):

```powershell
npm run test:e2e:generate-report
if ($LASTEXITCODE -eq 0) { npm run test:e2e:report }
```

- One-step: run tests and open report (npm script):

```powershell
npm run test:e2e:with-report
```

4. Run a single test or filtered tests (useful for iterating):

```powershell
# Run tests matching the title (grep by text)
npx playwright test -g "creates a new product"

# Run a single file and open headed
npx playwright test e2e/product.spec.ts --headed
```

5. Make tests human-like (slow, visible, sequential):

- Use headed mode (`--headed`) so a real browser window opens.
- Slow down browser actions by setting `launchOptions.slowMo` in `product-client/playwright.config.ts` (milliseconds). Example:

```ts
// product-client/playwright.config.ts
use: {
  launchOptions: { slowMo: 150 }, // 150ms between actions
  headless: false,
}
```

- Run with a single worker so tests run sequentially and are easier to follow:

```powershell
npx playwright test --workers=1 --headed
```

6. Fast-forward / speed up tests (CI-like):

- Use headless mode, zero slowMo and multiple workers:

```powershell
npx playwright test --workers=4 --reporter=html
```

- Or edit `playwright.config.ts` to set `launchOptions.slowMo = 0` and `workers` to a higher number for local performance runs.

7. Interactive debugging and stepping through flows:

- Insert `await page.pause()` into a test to pause execution and open Playwright Inspector at that point.
- Run with the debug flag to auto-open the inspector: `npx playwright test --debug` (or set `PWDEBUG=1`).

8. Tips for editing tests:

- Use `test.only` or `test.describe.only` to focus on a single test while developing.
- Use `page.pause()` or `console.log()` to inspect state during runs.
- Use `--workers=N` to scale concurrency when exercising performance, but keep `--workers=1` when you want a human-observable single flow.

9. Where to change behavior in the repo:

- `product-client/playwright.config.ts` — central config for `headless`, `slowMo` (`launchOptions`), `workers`, `trace`, `video`, and `webServer`.
- `product-client/e2e/product.spec.ts` — example tests (mocked API routes are set up in the `beforeEach` in this file).

If you want, I can add a short example test that demonstrates `page.pause()` or show how to toggle `slowMo` via an environment variable. Tell me which variant you'd like and I will add it.

Enjoy exploring or extending this sample API for learning ASP.NET Core and EF Core patterns.

## Recent Local Changes (from get_changed_files)

- `ProductSample.API/Program.cs` — Added CORS policy `AllowFrontend` and `app.UseCors("AllowFrontend")` to permit the frontend at `http://localhost:5173` during local development.
- `README.md` — Updated overview and added Playwright test instructions under `product-client`.

Last updated by: Mhack03
