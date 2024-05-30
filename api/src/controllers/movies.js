// import { MovieModel } from '../models/movie.js'
// import { MovieModel } from '../models/movies.mysql.js'
import { validateMovie, validatePartialMovie } from '../schemas/movie.schema.js'

export class MovieController {
  /** Cada una de estas funciones deberian tener un try-catch para
   * manejar los errores, sin embargo, se va a implementar un middleware para
   * capturar todos los errores de una forma mas elegante
   */
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const movies = await this.movieModel.getAll({ genre })
    res.json(movies)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const movie = await this.movieModel.getById({ id })
    if (movie) return res.status(200).json(movie)

    res.status(404).json({ message: 'Movie not found' })
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newMovie = await this.movieModel.create({ input: result.data })
    res.status(201).json(newMovie)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.movieModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    }
    res.status(200).json({ message: 'Movie deleted' })
  }

  update = async (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { id } = req.params
    const updatedMovie = await this.movieModel.update({ id, input: result.data })
    res.json(updatedMovie)
  }
}
