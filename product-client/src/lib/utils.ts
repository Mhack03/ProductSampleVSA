import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * cn() merges Tailwind CSS classes safely.
 * Without this, conflicting classes (e.g. "p-2 p-4") would both apply.
 * With this, the last one wins: cn("p-2", "p-4") → "p-4"
 *
 * Usage: cn("base-class", condition && "conditional-class", "override")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}