'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { getStatusColor } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'status' | 'role' | 'urgency'
  status?: string
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', status, size = 'sm', className }: BadgeProps) {
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }
  const variants = {
    default: 'bg-light-teal text-primary',
    status: status ? getStatusColor(status) : 'bg-gray-100 text-gray-800',
    role: 'bg-secondary/10 text-secondary-dark',
    urgency: '',
  }
  return (
    <span className={cn('inline-flex items-center font-medium rounded-full', sizes[size], variants[variant], className)}>
      {children}
    </span>
  )
}
