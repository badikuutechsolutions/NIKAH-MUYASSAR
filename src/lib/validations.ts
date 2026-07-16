import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['applicant', 'sponsor'], { required_error: 'Please select a role' }),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  category: z.enum(['general', 'application', 'sponsorship', 'technical', 'media', 'other']).default('general'),
})

export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  age: z.number().min(18, 'Must be at least 18 years old').max(80, 'Age must be under 80'),
  gender: z.enum(['male', 'female'], { required_error: 'Gender is required' }),
  maritalStatus: z.enum(['single', 'widowed', 'divorced']).default('single'),
  nationality: z.string().min(2, 'Nationality is required'),
  countryOfResidence: z.string().min(2, 'Country is required'),
  city: z.string().min(2, 'City is required'),
  occupation: z.string().optional(),
  phone: z.string().min(5, 'Phone number is required'),
  whatsapp: z.string().optional(),
})

export const financialInfoSchema = z.object({
  hasEmployment: z.boolean().default(false),
  employmentType: z.enum(['employed', 'self-employed', 'unemployed', 'student']).optional(),
  monthlyIncome: z.number().positive('Monthly income must be positive').optional(),
  incomeCurrency: z.string().default('USD'),
  financialHardshipDesc: z.string().min(100, 'Please provide at least 100 characters describing your situation'),
  hasExistingDebt: z.boolean().default(false),
  debtDescription: z.string().optional(),
  estimatedWeddingCost: z.number().positive('Wedding cost must be positive').optional(),
  amountRequested: z.number().positive('Amount requested must be positive'),
})

export const islamicBackgroundSchema = z.object({
  religiosityLevel: z.enum(['practicing', 'moderate', 'learning'], { required_error: 'Please select your level' }),
  isAlreadyEngaged: z.boolean().default(false),
  partnerName: z.string().optional(),
  partnerNationality: z.string().optional(),
  howTheyMet: z.string().optional(),
  localMosqueName: z.string().min(2, 'Mosque name is required'),
  localMosqueCity: z.string().min(2, 'Mosque city is required'),
  imamReferenceName: z.string().min(2, 'Imam name is required'),
  imamContact: z.string().min(5, 'Imam contact is required'),
  reasonForMarriage: z.string().min(50, 'Please write at least 50 characters about why you want to marry'),
})

export const applicationSchema = personalInfoSchema.merge(financialInfoSchema).merge(islamicBackgroundSchema)

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type PersonalInfoInput = z.infer<typeof personalInfoSchema>
export type FinancialInfoInput = z.infer<typeof financialInfoSchema>
export type IslamicBackgroundInput = z.infer<typeof islamicBackgroundSchema>
export type ApplicationInput = z.infer<typeof applicationSchema>
