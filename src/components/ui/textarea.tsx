'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  showCount?: boolean
  maxLength?: number
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, showCount, maxLength, value, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(typeof value === 'string' ? value.length : 0)

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-charcoal mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-charcoal transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-y',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          value={value}
          onChange={(e) => {
            setCharCount(e.target.value.length)
            if (props.onChange) props.onChange(e)
          }}
          {...props}
        />
        <div className="flex justify-between mt-1">
          {error ? <p className="text-sm text-red-500">{error}</p> : <span />}
          {showCount && maxLength && (
            <p className="text-xs text-gray-400">{charCount}/{maxLength}</p>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
