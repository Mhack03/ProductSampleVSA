/**
 * Mirrors FilterProductRequest in the .NET API.
 * Used as query parameters for GET /api/product
 * All fields are optional — you only send what you want to filter by.
 */
export interface ProductFilter {
  name?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  isActive?: boolean
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt'
  sortDescending?: boolean
  page?: number
  pageSize?: number
}

/**
 * Mirrors ProductResponse in the .NET API.
 * This is what you receive from the API for a single product.
 */
export interface ProductResponse {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  isActive: boolean
  createdAt: string   // ISO date string from the API
  updatedAt: string | null
  sku: string | null
  brand: string | null
  category: string | null
  weightKg: number | null
}

/**
 * Mirrors PagedResult<ProductResponse> in the .NET API.
 * The generic wrapper your API returns for list endpoints.
 */
export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

/**
 * Mirrors CreateProductRequest in the .NET API.
 * What you send in the body of POST /api/product
 */
export interface CreateProductRequest {
  name: string
  description?: string | null
  price: number
  stock: number
  sku?: string | null
  brand?: string | null
  category?: string | null
  weightKg?: number | null
}

/**
 * Mirrors UpdateProductRequest in the .NET API.
 * What you send in the body of PUT /api/product/{id}
 */
export interface UpdateProductRequest {
  name: string
  description?: string | null
  price: number
  stock: number
  isActive: boolean
  sku?: string | null
  brand?: string | null
  category?: string | null
  weightKg?: number | null
}