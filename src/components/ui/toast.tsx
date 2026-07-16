'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#FFFDF7',
          border: '1px solid #E8F5F5',
          color: '#1A1A2E',
        },
      }}
      icons={{
        success: '✅',
        error: '❌',
      } as any}
    />
  )
}
