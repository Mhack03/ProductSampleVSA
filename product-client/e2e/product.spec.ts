import { test, expect } from '@playwright/test'

type MockProduct = {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  isActive: boolean
  createdAt: string
  updatedAt: string | null
  sku: string | null
  brand: string | null
  category: string | null
  weightKg: number | null
}

function buildProduct(overrides: Partial<MockProduct> = {}): MockProduct {
  return {
    id: overrides.id ?? 1,
    name: overrides.name ?? 'Sample Product',
    description: overrides.description ?? 'Sample product description',
    price: overrides.price ?? 1,
    stock: overrides.stock ?? 1,
    isActive: overrides.isActive ?? true,
    createdAt: overrides.createdAt ?? new Date().toISOString(),
    updatedAt: overrides.updatedAt ?? null,
    sku: overrides.sku ?? null,
    brand: overrides.brand ?? null,
    category: overrides.category ?? null,
    weightKg: overrides.weightKg ?? null,
  }
}

test.describe('Products page', () => {
  test.beforeEach(async ({ page }) => {
    const runId = Date.now()
    const products: MockProduct[] = []

    await page.route(/\/api\/product(?:[/?#]|$)/, async (route, request) => {
      const url = new URL(request.url())
      const method = request.method()

      if (method === 'OPTIONS') {
        await route.fulfill({
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'access-control-allow-headers': 'content-type',
          },
        })
        return
      }

      if (method === 'GET') {
        const name = url.searchParams.get('name')?.toLowerCase() ?? ''
        const items = products.filter((product) =>
          name ? product.name.toLowerCase().includes(name) : true,
        )

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            items,
            totalCount: items.length,
            page: Number(url.searchParams.get('page') ?? 1),
            pageSize: Number(url.searchParams.get('pageSize') ?? 10),
            totalPages: items.length > 0 ? 1 : 0,
            hasPreviousPage: false,
            hasNextPage: false,
          }),
        })
        return
      }

      if (method === 'POST') {
        const body = JSON.parse(request.postData() ?? '{}')
        // Simulate server error for names containing 'fail' to test error handling
        if ((body.name as string | undefined)?.toLowerCase().includes('fail')) {
          await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ title: 'Server error creating product' }),
          })
          return
        }

        const createdProduct = buildProduct({
          id: products.length + 1,
          name: body.name,
          description: body.description ?? null,
          price: body.price,
          stock: body.stock,
          sku: body.sku ?? null,
          brand: body.brand ?? null,
          category: body.category ?? null,
          weightKg: body.weightKg ?? null,
        })

        products.push(createdProduct)
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          headers: {
            'access-control-allow-origin': '*',
          },
          body: JSON.stringify(createdProduct),
        })
        return
      }

      if (method === 'PUT') {
        // Update product by id in the URL: /api/product/{id}
        const id = Number(url.pathname.split('/').pop())
        const body = JSON.parse(request.postData() ?? '{}')
        const idx = products.findIndex((p) => p.id === id)
        if (idx === -1) {
          await route.fulfill({ status: 404, body: '' })
          return
        }

        const updated = { ...products[idx], ...body, updatedAt: new Date().toISOString() }
        products[idx] = updated
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(updated),
        })
        return
      }

      if (method === 'DELETE') {
        const id = Number(url.pathname.split('/').pop())
        const idx = products.findIndex((p) => p.id === id)
        if (idx === -1) {
          await route.fulfill({ status: 404, body: '' })
          return
        }
        products.splice(idx, 1)
        await route.fulfill({ status: 204, body: '' })
        return
      }

      await route.continue()
    })

    await page.goto(`/products?runId=${runId}`)
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('Something went wrong')).toHaveCount(0)
  })

  test('renders products page and add product button', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible()
    await expect(page.getByRole('button', { name: /add product/i })).toBeVisible()
  })

  test('creates a new product and displays it in the list', async ({ page }) => {
    await page.getByRole('button', { name: /add product/i }).click()

    await page.getByLabel('Name *').fill('E2E Sample Product')
    await page.getByLabel('Description').fill('Automated test product description')
    await page.getByLabel('Price *').fill('21.50')
    await page.getByLabel('Stock *').fill('10')
    await page.getByLabel('SKU').fill('E2E-100')
    await page.getByLabel('Brand').fill('Playwright')
    await page.getByLabel('Category').fill('Testing')
    await page.getByLabel('Weight (kg)').fill('0.62')

    await page.getByRole('button', { name: /create product/i }).click()

    // Verify product appears in the table/list after the API returns
    await expect(page.locator('text=E2E Sample Product')).toBeVisible({ timeout: 15000 })
  })

  test('search filters products by name', async ({ page }) => {
    const uniqueName = `E2E Sample Product ${Date.now()}`

    await page.getByRole('button', { name: /add product/i }).click()
    await page.getByLabel('Name *').fill(uniqueName)
    await page.getByLabel('Description').fill('Search test product')
    await page.getByLabel('Price *').fill('10')
    await page.getByLabel('Stock *').fill('1')
    await page.getByRole('button', { name: /create product/i }).click()

    await expect(page.locator(`text=${uniqueName}`)).toBeVisible({ timeout: 15000 })

    await page.getByPlaceholder('Search by name...').fill(uniqueName)
    await expect(page.locator(`text=${uniqueName}`)).toBeVisible()
  })

  test('shows validation errors when required fields missing', async ({ page }) => {
    await page.getByRole('button', { name: /add product/i }).click()

    // Submit the form with defaults (name empty, price 0) and expect validation errors
    await page.getByRole('button', { name: /create product/i }).click()

    await expect(page.locator('text=Name is required')).toBeVisible()
    await expect(page.locator('text=Price must be greater than zero')).toBeVisible()

    // Fill only the name (still invalid price) — price error should remain
    await page.getByLabel('Name *').fill('Incomplete Product')
    await expect(page.locator('text=Name is required')).toHaveCount(0)
    await expect(page.locator('text=Price must be greater than zero')).toBeVisible()
  })

  test('creates multiple products and lists them', async ({ page }) => {
    const nameA = `Product A ${Date.now()}`
    const nameB = `Product B ${Date.now()}`

    // Create first product
    await page.getByRole('button', { name: /add product/i }).click()
    await page.getByLabel('Name *').fill(nameA)
    await page.getByLabel('Price *').fill('5')
    await page.getByLabel('Stock *').fill('2')
    await page.getByRole('button', { name: /create product/i }).click()
    await expect(page.locator(`text=${nameA}`)).toBeVisible({ timeout: 15000 })

    // Create second product
    await page.getByRole('button', { name: /add product/i }).click()
    await page.getByLabel('Name *').fill(nameB)
    await page.getByLabel('Price *').fill('7')
    await page.getByLabel('Stock *').fill('3')
    await page.getByRole('button', { name: /create product/i }).click()

    // Verify both appear in the list
    await expect(page.locator(`text=${nameA}`)).toBeVisible()
    await expect(page.locator(`text=${nameB}`)).toBeVisible()
  })

  test('search is case-insensitive', async ({ page }) => {
    const mixedCase = `MiXeDCase ${Date.now()}`

    await page.getByRole('button', { name: /add product/i }).click()
    await page.getByLabel('Name *').fill(mixedCase)
    await page.getByLabel('Price *').fill('12')
    await page.getByLabel('Stock *').fill('1')
    await page.getByRole('button', { name: /create product/i }).click()

    // Search using all-lowercase version of the name
    await page.getByPlaceholder('Search by name...').fill(mixedCase.toLowerCase())
    await expect(page.locator(`text=${mixedCase}`)).toBeVisible()
  })

  test('edits an existing product', async ({ page }) => {
    const name = `To Edit ${Date.now()}`

    // create
    await page.getByRole('button', { name: /add product/i }).click()
    await page.getByLabel('Name *').fill(name)
    await page.getByLabel('Price *').fill('9')
    await page.getByLabel('Stock *').fill('1')
    await page.getByRole('button', { name: /create product/i }).click()
    await expect(page.locator(`text=${name}`)).toBeVisible({ timeout: 15000 })

    // open edit dialog for the row and change values
    const row = page.locator('tr', { hasText: name })
    await row.locator('button').first().click() // edit (pencil)

    await page.getByLabel('Name *').fill(`${name} - Edited`)
    // toggle active checkbox off
    const isActive = page.locator('input#isActive')
    await isActive.uncheck()
    await page.getByRole('button', { name: /save changes/i }).click()

    // assert updated name and inactive badge
    await expect(page.locator(`text=${name} - Edited`)).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=Inactive')).toBeVisible()
  })

  test('deletes a product', async ({ page }) => {
    const name = `To Delete ${Date.now()}`

    // create
    await page.getByRole('button', { name: /add product/i }).click()
    await page.getByLabel('Name *').fill(name)
    await page.getByLabel('Price *').fill('3')
    await page.getByLabel('Stock *').fill('1')
    await page.getByRole('button', { name: /create product/i }).click()
    await expect(page.locator(`text=${name}`)).toBeVisible({ timeout: 15000 })

    const row = page.locator('tr', { hasText: name })
    // click delete (trash) button — second button in actions
    await row.locator('button').nth(1).click()

    // Confirm delete in dialog
    await page.getByRole('button', { name: /delete/i }).click()

    // Verify it's gone
    await expect(page.locator(`text=${name}`)).toHaveCount(0)
  })

  test('shows toast on server error when creating product', async ({ page }) => {
    const name = `Fail Test ${Date.now()}`

    await page.getByRole('button', { name: /add product/i }).click()
    await page.getByLabel('Name *').fill(name)
    await page.getByLabel('Price *').fill('2')
    await page.getByLabel('Stock *').fill('1')
    await page.getByRole('button', { name: /create product/i }).click()

    // Expect toast with server error message
    await expect(page.locator('text=Server error creating product')).toBeVisible()
  })
})
