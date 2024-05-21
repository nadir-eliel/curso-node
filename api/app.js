import express, { json } from 'express'
// En ES Modules, hay que poner la extension .js en los imports
import { createMovieRouter } from './src/routes/movies.js'
import { corsMiddleware } from './src/middlewares/cors.js'
import { MovieModel } from './src/models/movie.js'

const app = express()

// middlewares
app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware)

app.use('/movies', createMovieRouter({ movieModel: MovieModel }))

export default app
