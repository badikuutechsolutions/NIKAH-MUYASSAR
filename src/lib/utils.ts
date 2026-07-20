import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'KES'): string {
  if (currency === 'KES') return `KSh ${amount.toLocaleString()}`
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    'Afghanistan': '🇦🇫', 'Algeria': '🇩🇿', 'Bahrain': '🇧🇭', 'Bangladesh': '🇧🇩',
    'Egypt': '🇪🇬', 'Indonesia': '🇮🇩', 'Iran': '🇮🇷', 'Iraq': '🇮🇶', 'Jordan': '🇯🇴',
    'Kuwait': '🇰🇼', 'Lebanon': '🇱🇧', 'Libya': '🇱🇾', 'Malaysia': '🇲🇾',
    'Maldives': '🇲🇻', 'Mali': '🇲🇱', 'Mauritania': '🇲🇷', 'Morocco': '🇲🇦',
    'Niger': '🇳🇪', 'Nigeria': '🇳🇬', 'Oman': '🇴🇲', 'Pakistan': '🇵🇰',
    'Palestine': '🇵🇸', 'Qatar': '🇶🇦', 'Saudi Arabia': '🇸🇦', 'Senegal': '🇸🇳',
    'Somalia': '🇸🇴', 'Sudan': '🇸🇩', 'Syria': '🇸🇾', 'Tajikistan': '🇹🇯',
    'Tunisia': '🇹🇳', 'Turkey': '🇹🇷', 'Turkmenistan': '🇹🇲', 'UAE': '🇦🇪',
    'Uganda': '🇺🇬', 'UK': '🇬🇧', 'USA': '🇺🇸', 'Uzbekistan': '🇺🇿', 'Yemen': '🇾🇪',
    'Canada': '🇨🇦', 'France': '🇫🇷', 'Germany': '🇩🇪', 'Netherlands': '🇳🇱',
    'Australia': '🇦🇺', 'India': '🇮🇳', 'Kenya': '🇰🇪', 'Tanzania': '🇹🇿',
    'South Africa': '🇿🇦', 'Ethiopia': '🇪🇹', 'Albania': '🇦🇱', 'Bosnia': '🇧🇦',
    'Kosovo': '🇽🇰', 'China': '🇨🇳', 'Thailand': '🇹🇭', 'Singapore': '🇸🇬',
    'Philippines': '🇵🇭', 'Myanmar': '🇲🇲', 'Sierra Leone': '🇸🇱',
  }
  return flags[country] || '🌍'
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    under_review: 'bg-blue-100 text-blue-800',
    info_requested: 'bg-amber-100 text-amber-800',
    approved: 'bg-green-100 text-green-800',
    sponsored: 'bg-teal-100 text-teal-800',
    partially_funded: 'bg-teal-100 text-teal-800',
    fully_funded: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
    withdrawn: 'bg-gray-100 text-gray-600',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}
