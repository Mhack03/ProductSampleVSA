import * as React from 'react'
import { ToastContext } from './toast-context'
import type { ToastContextValue } from './toast-context'

export function useToast() {
  const context = React.useContext<ToastContextValue | undefined>(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return {
    success: (title: string) => context.showToast(title, 'success'),
    error: (title: string) => context.showToast(title, 'error'),
    info: (title: string) => context.showToast(title, 'info'),
  }
}
