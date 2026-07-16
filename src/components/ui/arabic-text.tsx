'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ArabicTextProps {
  text: string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export function ArabicText({ text, className, size = 'lg' }: ArabicTextProps) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl',
    xl: 'text-3xl md:text-4xl',
    '2xl': 'text-4xl md:text-5xl',
  }
  return (
    <p
      dir="rtl"
      className={cn('font-arabic leading-relaxed', sizes[size], className)}
    >
      {text}
    </p>
  )
}
