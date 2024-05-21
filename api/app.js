import express, { json } from 'express'
// En ES Modules, hay que poner la extension .js en los imports
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
import { MovieModel } from './models/movies.mysql.js'

const app = express()

// middlewares
app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware)

app.use('/movies', createMovieRouter({ movieModel: MovieModel }))

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
