import * as React from 'react'

type ToastType = 'success' | 'error' | 'info'

export type ToastContextValue = {
  showToast: (title: string, type?: ToastType) => void
}

export const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)
