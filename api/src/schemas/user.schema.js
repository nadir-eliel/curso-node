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

export function validateUser (input) {
  return userSchema.safeParse(input)
}

// Por ahora dejo este schemas asi de simple porque solo lo necesito para el Login
/*
    {
      "username": "user1",
      "password": "$2a$04$8xSYt3/46b48zZhGnivJN.ogSYvkAAoXIeSbaaUWxno/1cRoCCfCm",
      "nombre": "Juan",
      "apellido": "Perez",
      "fechaNacimiento": "1980-01-01",
      "email": "juan.perez@example.com",
      "direccion": {
        "calle": "Calle Mayor 123",
        "ciudad": "Ciudad del Ejemplo",
        "pais": "España"
      },
      "telefono": "+34 612 345 678"
    },
*/
