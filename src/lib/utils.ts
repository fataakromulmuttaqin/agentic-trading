import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number, decimals = 2): string {
  const num = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPct(pct: string | number): string {
  const num = typeof pct === 'string' ? parseFloat(pct) : pct;
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
}
