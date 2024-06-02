import cors from 'cors'
import jwt from 'jsonwebtoken'

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://localhost:3000'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})

// middleware de manejo de rutas inexistentes
export const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// general error handler
export const internalError = (err, req, res) => {
  // the default status is 500 Internal Server Error
  const status = err.status || 500

  return res.status(status).json({
    error: {
      message: err.message,
      status
    }
  })
}
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(401).json({ message: 'Not authorized' })

    req.user = user

    next()
  })
}
