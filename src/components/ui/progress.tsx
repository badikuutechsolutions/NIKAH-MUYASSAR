'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max: number
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export function ProgressBar({ value, max, className, showLabel = true, size = 'md', color }: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)
  const heights = { sm: 'h-2', md: 'h-3', lg: 'h-4' }

  return (
    <div className="w-full">
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', heights[size], className)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', heights[size])}
          style={{
            width: `${percentage}%`,
            background: color || (percentage >= 100 ? 'linear-gradient(90deg, #0D7377, #F4A81D)' : '#0D7377'),
          }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{percentage}% funded</span>
          <span className="text-xs text-gray-500">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value)}{' '}
            raised of{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(max)}
          </span>
        </div>
      )}
    </div>
  )
}
