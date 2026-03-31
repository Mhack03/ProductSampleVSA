import apiClient from './axios'
import type {
  ProductFilter,
  ProductResponse,
  PagedResult,
  CreateProductRequest,
  UpdateProductRequest,
} from '@/products/types/product.types'

/**
 * All API calls for the Products feature.
 * 
 * Each function maps to one endpoint in your ProductController.
 * They return the data directly (not the full Axios response)
 * because the caller only cares about the data.
 */

/**
 * GET /api/product
 * Fetch a paginated, filtered list of products.
 * 
 * The filter object becomes query string params:
 * e.g. /api/product?name=apple&page=1&pageSize=10
 */
export async function getProducts(
  filter: ProductFilter = {}
): Promise<PagedResult<ProductResponse>> {
  const { data } = await apiClient.get<PagedResult<ProductResponse>>('/product', {
    params: filter,
  })
  return data
}

/**
 * GET /api/product/{id}
 * Fetch a single product by its ID.
 */
export async function getProductById(id: number): Promise<ProductResponse> {
  const { data } = await apiClient.get<ProductResponse>(`/product/${id}`)
  return data
}

/**
 * POST /api/product
 * Create a new product.
 * Returns the newly created product (with its assigned ID).
 */
export async function createProduct(
  request: CreateProductRequest
): Promise<ProductResponse> {
  const { data } = await apiClient.post<ProductResponse>('/product', request)
  return data
}

/**
 * PUT /api/product/{id}
 * Update an existing product by ID.
 * Returns the updated product.
 */
export async function updateProduct(
  id: number,
  request: UpdateProductRequest
): Promise<ProductResponse> {
  const { data } = await apiClient.put<ProductResponse>(`/product/${id}`, request)
  return data
}

/**
 * DELETE /api/product/{id}
 * Delete a product by ID.
 * Returns nothing (204 No Content).
 */
export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/product/${id}`)
}