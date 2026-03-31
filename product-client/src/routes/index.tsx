import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <h1 className="text-4xl font-bold">Welcome to MyWeb</h1>
      <p className="text-muted-foreground">Manage your products with ease.</p>
      <Link
        to="/products"
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
      >
        View Products
      </Link>
    </div>
  ),
})
