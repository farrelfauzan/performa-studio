import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import z from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateWithZod<T>(schema: z.ZodType<T>) {
  return ({ value }: { value: T }) => {
    const result = schema.safeParse(value)
    return result.success ? undefined : result.error.issues[0]?.message
  }
}
