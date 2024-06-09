import express, { json } from 'express'
// En ES Modules, hay que poner la extension .js en los imports
import { createMovieRouter } from './src/routes/movies.js'
import { createUserRouter } from './src/routes/user.js'
import { internalError, unknownEndpoint } from './src/middlewares/middlewares.js'
// import { MovieModel } from './src/models/movies.mysql.js'
// import { UserModel } from './src/models/user.mysql.js'
import { Movie } from './src/models/sequelize/movie.model.js'
import { User } from './src/models/sequelize/user.model.js'
import cors from 'cors'

const app = express()

// middlewares
app.disable('x-powered-by')
app.use(json())
app.use(cors())

// routes
app.use('/users', createUserRouter({ userModel: User }))
app.use('/movies', createMovieRouter({ movieModel: Movie }))

// errors
app.use(unknownEndpoint)
app.use(internalError) // FIXME:
export default app
