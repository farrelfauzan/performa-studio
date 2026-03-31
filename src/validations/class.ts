import { z } from 'zod'

export const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(255),
  description: z.string().max(1000).optional().or(z.literal('')),
})

export type CreateClassFormData = z.infer<typeof createClassSchema>

export const updateClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(255).optional(),
  description: z.string().max(1000).optional().or(z.literal('')),
  active: z.enum(['ACTIVE', 'INACTIVE']).optional(),
})

export type UpdateClassFormData = z.infer<typeof updateClassSchema>
