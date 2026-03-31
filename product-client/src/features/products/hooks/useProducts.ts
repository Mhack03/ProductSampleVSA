import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '@/api/products.api'
import { useToast } from '@/components/ui/use-toast'
import type {
  CreateProductRequest,
  ProductFilter,
  UpdateProductRequest,
} from '@/products/types/product.types'

/**
 * QUERY KEYS
 * Think of query keys as cache addresses.
 * ['products'] = the products list cache
 * ['products', filter] = the list cache for a specific filter
 * ['products', 'detail', id] = the cache for a single product
 * 
 * Keeping keys in one place prevents typos and makes
 * invalidation (cache-busting) precise and reliable.
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filter: ProductFilter) => [...productKeys.lists(), filter] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
}

/**
 * Fetch paginated product list.
 * When `filter` changes (e.g. user types in search box), 
 * TanStack Query automatically refetches with the new filter.
 */
export function useProducts(filter: ProductFilter = {}) {
  return useQuery({
    queryKey: productKeys.list(filter),
    queryFn: () => getProducts(filter),
  })
}

/**
 * Fetch a single product by ID.
 * enabled: false when id is undefined — don't fetch until we have an ID.
 */
export function useProduct(id: number | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id!),
    queryFn: () => getProductById(id!),
    enabled: id !== undefined,
  })
}

/**
 * Create product mutation.
 * On success: invalidates the products list so it refetches fresh data.
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (request: CreateProductRequest) => createProduct(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success('Product created successfully')
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof Error
          ? error.message
          : 'Failed to create product. Please try again.'
      toast.error(msg)
    },
  })
}

/**
 * Update product mutation.
 * On success: invalidates both the list AND the specific product detail cache.
 */
export function useUpdateProduct(id: number) {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (request: UpdateProductRequest) => updateProduct(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) })
      toast.success('Product updated successfully')
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof Error
          ? error.message
          : 'Failed to update product. Please try again.'
      toast.error(msg)
    },
  })
}

/**
 * Delete product mutation.
 * On success: invalidates the list so the deleted item disappears.
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
      toast.success('Product deleted successfully')
    },
    onError: (error: unknown) => {
      const msg =
        error instanceof Error
          ? error.message
          : 'Failed to delete product. Please try again.'
      toast.error(msg)
    },
  })
}