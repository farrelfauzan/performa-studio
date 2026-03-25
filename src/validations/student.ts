import { z } from 'zod'

export const studentFieldSchemas = {
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name is required').max(100),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
}

export const createStudentSchema = z.object(studentFieldSchemas)

export type CreateStudentFormData = z.infer<typeof createStudentSchema>

export const assignContentSchema = z.object({
  contentId: z.string().min(1, 'Please select content to assign'),
  dueDate: z.string().optional().or(z.literal('')),
})

export const assignStudentsSchema = z.object({
  studentIds: z.array(z.string()).min(1, 'Select at least one student'),
  dueDate: z.string().optional().or(z.literal('')),
})
