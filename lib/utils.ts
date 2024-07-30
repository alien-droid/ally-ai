import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteURL(url: string): string {
  return `${process.env.NEXT_APP_PUBLIC_URL}${url}`
}