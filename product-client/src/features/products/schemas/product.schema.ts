import { z } from 'zod'

const emptyStringToUndefined = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value

const emptyNumberToUndefined = (value: unknown) => {
  if (typeof value === 'number' && Number.isNaN(value)) return undefined
  if (typeof value === 'string' && value.trim() === '') return undefined
  return value
}

/**
 * WHY ZOD?
 * You already validate on the backend with FluentValidation.
 * Zod is your frontend equivalent — same rules, instant feedback.
 * 
 * z.object() defines the shape.
 * Each field has its own chain of rules.
 * .optional() means the field can be undefined.
 * .nullable() means the field can be null.
 * .nullish() means undefined OR null (useful for optional API fields).
 */

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must not exceed 200 characters'),

  description: z.preprocess(emptyStringToUndefined, z.string().nullish()),

  price: z
    .number()
    .positive('Price must be greater than zero'),

  stock: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),

  sku: z.preprocess(emptyStringToUndefined, z.string().nullish()),
  brand: z.preprocess(emptyStringToUndefined, z.string().nullish()),
  category: z.preprocess(emptyStringToUndefined, z.string().nullish()),
  weightKg: z.preprocess(
    emptyNumberToUndefined,
    z.number().positive('Weight must be positive').nullish(),
  ),
})

/**
 * For update, we extend create schema and add isActive.
 * z.infer<> extracts the TypeScript type FROM the schema
 * so you never have to write the type manually — Zod generates it.
 */
export const updateProductSchema = createProductSchema.extend({
  isActive: z.boolean(),
})

export const filterProductSchema = z.object({
  name: z.preprocess(emptyStringToUndefined, z.string().optional()),
  category: z.preprocess(emptyStringToUndefined, z.string().optional()),
  brand: z.preprocess(emptyStringToUndefined, z.string().optional()),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  sortBy: z.enum(['name', 'price', 'stock', 'createdAt']).default('name'),
  sortDescending: z.boolean().default(false),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
})

/**
 * TypeScript types inferred automatically from the Zod schemas.
 * These are what React Hook Form uses for its generic type parameter.
 * No need to manually write a separate interface.
 */
export type CreateProductFormValues = z.infer<typeof createProductSchema>
export type UpdateProductFormValues = z.infer<typeof updateProductSchema>
export type FilterProductFormValues = z.infer<typeof filterProductSchema>