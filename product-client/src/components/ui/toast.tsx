import * as React from 'react'
import { cn } from '@/lib/utils'
import { ToastContext } from './toast-context'

type ToastType = 'success' | 'error' | 'info'

type Toast = {
  id: string
  title: string
  type: ToastType
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const showToast = React.useCallback((title: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts((prev) => [...prev, { id, title, type }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3500)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex w-80 flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'rounded-lg border p-3 text-sm shadow-lg',
              toast.type === 'success' && 'border-emerald-300 bg-emerald-50 text-emerald-800',
              toast.type === 'error' && 'border-rose-300 bg-rose-50 text-rose-800',
              toast.type === 'info' && 'border-sky-300 bg-sky-50 text-sky-800'
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span>{toast.title}</span>
              <button
                className="text-xs font-semibold uppercase text-current opacity-70 hover:opacity-100"
                onClick={() => removeToast(toast.id)}
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

