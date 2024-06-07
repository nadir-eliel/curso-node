import z from 'zod'

const userSchema = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string().date(),
  email: z.string().email(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    country: z.string()
  }),
  phoneNumber: z.string()
})

const loginSchema = z.object({
  username: z.string(),
  password: z.string()
})

export function validateUser (input) {
  return userSchema.safeParse(input)
}

export function validateLogin (input) {
  return loginSchema.safeParse(input)
}
