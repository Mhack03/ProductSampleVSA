import { Link, createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ToastProvider } from "@/components/ui/toast";

export const Route = createRootRoute({
    component: () =>
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <header className="border-b bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
                    <span className="font-bold text-lg">MyWeb.API</span>
                    <nav className="flex gap-4">
                        <Link
                            to="/"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            activeProps={{ className: "text-foreground font-medium" }}
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            activeProps={{ className: "text-foreground font-medium" }}
                        >
                            Products
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Page content renders here */}
            <ToastProvider>
              <main className="max-w-7xl mx-auto px-4 py-8">
                <Outlet />
              </main>
            </ToastProvider>

            {/* Only shows in development — useful for debugging routes */}
            <TanStackRouterDevtools />
        </div>
});