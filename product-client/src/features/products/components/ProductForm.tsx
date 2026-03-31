import { useForm } from 'react-hook-form'
import type { Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductFormValues,
  type UpdateProductFormValues,
} from '../schemas/product.schema'
import type { ProductResponse } from '@/products/types/product.types'

// ---------- CREATE FORM ----------

interface CreateProductFormProps {
  onSubmit: (values: CreateProductFormValues) => void
  isLoading: boolean
}

export function CreateProductForm({ onSubmit, isLoading }: CreateProductFormProps) {
  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema) as Resolver<CreateProductFormValues>,
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      sku: '',
      brand: '',
      category: '',
      weightKg: undefined,
    },
  })

  const { register, handleSubmit, formState: { errors } } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-1">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" {...register('name')} placeholder="Product name" />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register('description')} placeholder="Optional description" />
      </div>

      {/* Price + Stock row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            {...register('stock', { valueAsNumber: true })}
          />
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* SKU + Brand row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...register('sku')} placeholder="e.g. PRD-001" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" {...register('brand')} placeholder="Brand name" />
        </div>
      </div>

      {/* Category + Weight row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...register('category')} placeholder="e.g. Electronics" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="weightKg">Weight (kg)</Label>
          <Input
            id="weightKg"
            type="number"
            step="0.01"
            {...register('weightKg', { valueAsNumber: true })}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating...' : 'Create Product'}
      </Button>
    </form>
  )
}

// ---------- UPDATE FORM ----------

interface UpdateProductFormProps {
  product: ProductResponse
  onSubmit: (values: UpdateProductFormValues) => void
  isLoading: boolean
}

export function UpdateProductForm({ product, onSubmit, isLoading }: UpdateProductFormProps) {
  const form = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateProductSchema) as Resolver<UpdateProductFormValues>,
    // Pre-fill every field with the existing product data
    defaultValues: {
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      stock: product.stock,
      isActive: product.isActive,
      sku: product.sku ?? '',
      brand: product.brand ?? '',
      category: product.category ?? '',
      weightKg: product.weightKg ?? undefined,
    },
  })

  const { register, handleSubmit, formState: { errors } } = form

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" {...register('name')} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register('description')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="price">Price *</Label>
          <Input id="price" type="number" step="0.01"
            {...register('price', { valueAsNumber: true })} />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="stock">Stock *</Label>
          <Input id="stock" type="number"
            {...register('stock', { valueAsNumber: true })} />
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...register('sku')} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" {...register('brand')} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="category">Category</Label>
          <Input id="category" {...register('category')} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="weightKg">Weight (kg)</Label>
          <Input id="weightKg" type="number" step="0.01"
            {...register('weightKg', { valueAsNumber: true })} />
        </div>
      </div>

      {/* Active toggle — only on update */}
      <div className="flex items-center gap-2">
        <input
          id="isActive"
          type="checkbox"
          {...register('isActive')}
          className="h-4 w-4"
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}