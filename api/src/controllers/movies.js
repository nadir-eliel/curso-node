// import { MovieModel } from '../models/movie.js'
// import { MovieModel } from '../models/movies.mysql.js'
import { validateMovie, validatePartialMovie } from '../schemas/movie.schema.js'
import fetch from 'node-fetch'

export class MovieController {
  /** Cada una de estas funciones deberian tener un try-catch para
   * manejar los errores, sin embargo, se va a implementar un middleware para
   * capturar todos los errores de una forma mas elegante
   */
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { year } = req.query
    // const movies = await this.movieModel.getAll({ genre })
    const movies = await this.movieModel.findAll({ where: { year } })
    res.json(movies)
  }

  getById = async (req, res) => {
    const { id } = req.params
    // const movie = await this.movieModel.getById({ id })
    const movie = await this.movieModel.findByPk(id)
    if (movie) return res.status(200).json(movie)

    res.status(404).json({ message: 'Movie not found' })
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newMovie = await this.movieModel.create(result.data)
    res.status(201).json(newMovie)
  }

  delete = async (req, res) => {
    const { id } = req.params
    // const result = await this.movieModel.delete({ id })
    const result = await this.movieModel.destroy({
      where: { id }
    })
    if (result === 0) {
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
    // const updatedMovie = await this.movieModel.update({ id, input: result.data })
    const { title, year, director, duration, poster, rate } = result.data
    const updatedMovie = await this.movieModel.update(
      { title, year, director, duration, poster, rate },
      { where: { id } }
    )

    if (updatedMovie[0] === 1) {
      res.json(result.data)
    } else {
      res.status(400).json({ error: 'Was not possible update' })
    }
  }

  getExternalData = async (req, res) => {
    // https://www.omdbapi.com/
    const apiKey = process.env.OMDB_APIKEY
    const { title } = req.query
    if (!title) {
      return res.status(400).json({ error: 'Title required' })
    }
    const url = `http://www.omdbapi.com/?apikey=${apiKey}&t=${title}`
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      }
    }

    try {
      const response = await fetch(url, options)
      const json = await response.json()
      return res.status(200).json(json)
    } catch (error) {
      console.error(error)
      return res.status(404).json({ error: error.Error })
    }
  }
}
