import z from 'zod'

const movieSchema = z.object({
  title: z.string(
    {
      invalid_type_error: 'Movie title must be a string',
      required_error: 'Movie title is required'
    })
    .trim()
    .min(5, { message: 'Must be 5 or more characters long' })
    .max(255, { message: 'Must be 5 or fewer characters long' }),
  year: z.number().int().min(1900).max(2025),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({ message: 'Poster must be a valid URL' }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Movie genre is required',
      invalid_type_error: 'Movie genre must be an arrya of enum Genre'
    }
  )
})

export function validateMovie (input) {
  return movieSchema.safeParse(input)
}

export function validatePartialMovie (input) {
  // Partial() hace que todos las props del schema sean opcionales
  return movieSchema.partial().safeParse(input)
}
