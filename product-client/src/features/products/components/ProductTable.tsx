import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Pencil, Trash2 } from 'lucide-react'
import { useDeleteProduct, useUpdateProduct } from '../hooks/useProducts'
import { UpdateProductForm } from './ProductForm'
import { DeleteProductDialog } from './DeleteProductDialog'
import type { ProductResponse } from '@/products/types/product.types'
import type { UpdateProductFormValues } from '../schemas/product.schema'

interface ProductTableProps {
  products: ProductResponse[]
}

export function ProductTable({ products }: ProductTableProps) {
  // Track which product the edit dialog is open for
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null)
  // Track which product's delete dialog is open
  const [deletingProduct, setDeletingProduct] = useState<ProductResponse | null>(null)

  const updateMutation = useUpdateProduct(editingProduct?.id ?? 0)
  const deleteMutation = useDeleteProduct()

  function handleUpdate(values: UpdateProductFormValues) {
    if (!editingProduct) return
    updateMutation.mutate(values, {
      onSuccess: () => setEditingProduct(null),
    })
  }

  function handleDelete() {
    if (!deletingProduct) return
    deleteMutation.mutate(deletingProduct.id, {
      onSuccess: () => setDeletingProduct(null),
    })
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.brand ?? '—'}</TableCell>
              <TableCell>{product.category ?? '—'}</TableCell>
              <TableCell className="text-right">
                ₱{product.price.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">{product.stock}</TableCell>
              <TableCell>
                <Badge variant={product.isActive ? 'default' : 'secondary'}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeletingProduct(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit Dialog */}
      <Dialog
        open={editingProduct !== null}
        onOpenChange={() => setEditingProduct(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product details and save changes.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <UpdateProductForm
              product={editingProduct}
              onSubmit={handleUpdate}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {deletingProduct && (
        <DeleteProductDialog
          productName={deletingProduct.name}
          open={deletingProduct !== null}
          onClose={() => setDeletingProduct(null)}
          onConfirm={handleDelete}
          isLoading={deleteMutation.isPending}
        />
      )}
    </>
  )
}