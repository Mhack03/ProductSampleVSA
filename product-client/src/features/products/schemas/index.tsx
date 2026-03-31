import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useProducts, useCreateProduct } from '@/features/products/hooks/useProducts'
import { ProductTable } from '@/features/products/components/ProductTable'
import { CreateProductForm } from '@/features/products/components/ProductForm'
import type { CreateProductFormValues } from '@/features/products/schemas/product.schema'
import type { ProductFilter } from '@/products/types/product.types'

export function ProductsPage() {
  const [filter, setFilter] = useState<ProductFilter>({
    page: 1,
    pageSize: 10,
    sortBy: 'name',
  })
  const [createOpen, setCreateOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading, error } = useProducts(filter)
  const createMutation = useCreateProduct()

  /**
   * When the user types in the search box, we update the filter.
   * TanStack Query sees that 'filter' changed and automatically
   * refetches the products list with the new search term.
   */
  function handleSearch(value: string) {
    setSearchInput(value)
    setFilter((prev) => ({ ...prev, name: value || undefined, page: 1 }))
  }

  function handleCreate(values: CreateProductFormValues) {
    createMutation.mutate(values, {
      onSuccess: () => setCreateOpen(false),
    })
  }

  function handlePageChange(newPage: number) {
    setFilter((prev) => ({ ...prev, page: newPage }))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm">
            {data ? `${data.totalCount} total products` : 'Loading...'}
          </p>
        </div>

        {/* Create Product Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Product</DialogTitle>
            </DialogHeader>
            <CreateProductForm
              onSubmit={handleCreate}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3">
        <Input
          placeholder="Search by name..."
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-md bg-destructive/10 text-destructive px-4 py-3 text-sm">
          {error.message}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="text-muted-foreground text-sm">Loading products...</div>
      )}

      {/* Table */}
      {data && data.items.length > 0 && (
        <ProductTable products={data.items} />
      )}

      {/* Empty state */}
      {data && data.items.length === 0 && !isLoading && (
        <div className="text-center py-12 text-muted-foreground">
          No products found. Create one to get started.
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.page} of {data.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.hasPreviousPage}
              onClick={() => handlePageChange(data.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.hasNextPage}
              onClick={() => handlePageChange(data.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}