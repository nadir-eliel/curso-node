const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const app = express()
const { validateMovie, validatePartialMovie } = require('./schemas/movie.schema')

// middlewares
app.disable('x-powered-by')
app.use(express.json())

app.get('/movies/all', (req, res) => {
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) {
    return res.json(movie)
  }

  res.status(404).json({message: `Movie not found, ID ${id}` })
})

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(item => {
      return item.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    })
    res.json(filteredMovies)
  }
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }
  // guarda en la BBDD
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }
  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(res.body)
  if (!result.success) {
    res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(item => item.id === id)

  if (movieIndex === -1) {
    res.status(404).json({ message: 'Movie not found' })
  }

  // TODO: este bloque no lo termino de entender
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  return res.json(updateMovie)
})
const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
