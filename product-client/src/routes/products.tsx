import { createFileRoute } from '@tanstack/react-router'
import { ProductsPage } from '@/features/products/schemas'

export const Route = createFileRoute('/products')({
  component: ProductsPage,
})
