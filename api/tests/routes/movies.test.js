import app from '../../app.js'
import request from 'supertest'

// FIXME:
// Este test funciona, pero requiere que la app funcione.
// Es decir, que va a la base de datos, o lee el archivo JSON
// que se usa como fuente de los datos.
// Deberia usar un mock
describe('GET /movies', () => {
  it('should responde with a 200 status code and Content-Type JSON', async () => {
    const response = await request(app).get('/movies').send()
    expect(response.statusCode).toBe(200)
    expect(response.header['content-type']).toBe('application/json; charset=utf-8')
  })

  it('should responde an array', async () => {
    const response = await request(app).get('/movies').send()
    expect(response.body).toBeInstanceOf(Array)
  })
}) // End Describe for GET /movies

describe('GET /movies/id', () => {
  const id = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3' // The Shawshank Redemption

  it('should responde with a 200 status code and Content-Type JSON', async () => {
    const response = await request(app).get(`/movies/${id}`).send()
    expect(response.statusCode).toBe(200)
    expect(response.header['content-type']).toBe('application/json; charset=utf-8')
  })

  it('should response an object with properties', async () => {
    const response = await request(app).get(`/movies/${id}`).send()

    const { title, year, director, duration, rate, poster, genre } = response.body
    expect(title).toBeDefined()
    expect(year).toBeDefined()
    expect(director).toBeDefined()
    expect(duration).toBeDefined()
    expect(rate).toBeDefined()
    expect(poster).toBeDefined()
    expect(genre).toBeInstanceOf(Array)
  })

  it('should return 404 for invalid ID', async () => {
    const id = 'invalidId'
    const response = await request(app).get(`/movies/${id}`).send()
    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({ message: 'Movie not found' })
    // expect(response.body).toHaveProperty('message', 'Movie not found') // It's the same
  })
})

describe('POST /movies', () => {
  const newMovie = {
    title: 'Terminator',
    year: 1984,
    director: 'James Cameron',
    duration: 185,
    rate: 8,
    poster: 'http://example.com/image.jpg',
    genre: ['Action', 'Sci-Fi']
  }

  it('should responde with a 201 status code and Content-Type JSON', async () => {
    const response = await request(app)
      .post('/movies').send(newMovie)

    expect(response.status).toBe(201)
    expect(response.header['content-type']).toBe('application/json; charset=utf-8')
  })

  it('should create a new movie and return it', async () => {
    const response = await request(app).post('/movies').send(newMovie)
    expect(response.statusCode).toBe(201)

    const { title, year, director, duration, rate, poster, genre, id } = response.body

    expect(title).toBe(newMovie.title)
    expect(year).toBe(newMovie.year)
    expect(director).toBe(newMovie.director)
    expect(duration).toBe(newMovie.duration)
    expect(rate).toBe(newMovie.rate)
    expect(poster).toBe(newMovie.poster)
    expect(genre).toEqual(newMovie.genre)
    expect(id).toBeDefined()
  })

  it('should response StatusCode 400 and return an Error when Movie object is not valid', async () => {
    const response = await request(app).post('/movies').send({})
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBeDefined()
    expect(response.body.error).toBeInstanceOf(Array)
  })
})

describe('DELETE /movies/id', () => {
  it('should responde with a 200 status code and Content-Type JSON', async () => {
    const id = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3' // The Shawshank Redemption
    const response = await request(app).delete(`/movies/${id}`).send()
    expect(response.statusCode).toBe(200)
    expect(response.header['content-type']).toBe('application/json; charset=utf-8')
  })

  it('should remove the movie from database', async () => {
    const id = 'c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf' // The Dark Knight

    const responseBeforeDelete = await request(app).get('/movies').send()
    const countBefore = responseBeforeDelete.body.length

    await request(app).delete(`/movies/${id}`).send() // Delete

    const responseAfterDelete = await request(app).get('/movies').send()
    const countAfter = responseAfterDelete.body.length

    expect(countBefore).toBe(countAfter + 1)
  })

  it('should return 404 and Error Message when invalid ID', async () => {
    const id = 'fakeId'
    const response = await request(app).delete(`/movies/${id}`).send()
    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBeDefined()
  })
})

describe('UPDATE /movies/id', () => {
  it('should responde with a 200 status code and content-type JSON', async () => {
    const id = '5ad1a235-0d9c-410a-b32b-220d91689a08' // Inception
    const updatedMovie = {
      title: 'InceptionUpdated',
      year: 2020,
      director: 'Christopher Nolan Hijo',
      duration: 150,
      poster: 'http://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg',
      genre: [
        'Action',
        'Adventure',
        'Sci-Fi',
        'Drama'
      ],
      rate: 9.7
    }

    const response = await request(app).patch(`/movies/${id}`).send(updatedMovie)
    expect(response.statusCode).toBe(200)
    expect(response.header['content-type']).toBe('application/json; charset=utf-8')
  })

  it('should update ', async () => {
    const id = '241bf55d-b649-4109-af7c-0e6890ded3fc' // Pulp Fiction
    const updatedMovie = {
      title: 'new Name',
      year: 2020,
      director: 'Christopher Nolan Hijo',
      duration: 150,
      poster: 'http://m.media-amazon.com/images/I/91Rc8cAmnAL._AC_UF1000,1000_QL80_.jpg',
      genre: [
        'Drama'
      ],
      rate: 9.7
    }

    const response = await request(app).patch(`/movies/${id}`).send(updatedMovie)
    const { title, year, director, duration, poster, genre, rate } = response.body
    expect(title).toBe(updatedMovie.title)
    expect(year).toBe(updatedMovie.year)
    expect(director).toBe(updatedMovie.director)
    expect(duration).toBe(updatedMovie.duration)
    expect(poster).toBe(updatedMovie.poster)
    expect(genre).toEqual(updatedMovie.genre)
    expect(rate).toBe(updatedMovie.rate)
  })
})
