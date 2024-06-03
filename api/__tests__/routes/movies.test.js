import app from '../../app.js'
// import mysql from 'mysql2/promise'
import request from 'supertest'
// import { config } from '../../db.js'
process.env.NODE_ENV = 'test'

// FIXME:
// Este test funciona, pero requiere que la app funcione.
// Es decir, que va a la base de datos, o lee el archivo JSON
// que se usa como fuente de los datos.
// Deberia usar un mock

// eslint-disable-next-line no-unused-vars
// let movie

// beforeEach(async () => {
//   const db = await mysql.createConnection(config)
//   const result = await db.query(`
//     INSERT INTO movies.movies (title, year, director, duration, poster, rate)
//     VALUES('Movie Example', 2024, 'Nadir Jaramillo', 120, 'https://aws:s3/imagen.jpg', 8.8);
//     SELECT LAST_INSERT_ID();`)
//   console.log(result)
//   movie = result.rows[0]
//   await db.end() // close db connection
// })

// afterEach(async function () {
//   const db = await mysql.createConnection(config)
//   // delete any data created by test
//   await db.query('DELETE FROM movies.movies WHERE title="Movie Example";')
//   await db.end() // close db connection
// })

// afterAll(async function () {
//   await db.end() // close db connection
// })
beforeAll(() => {
  process.env.TOKEN_SECRET = 'secret-for-jwt'
  process.env.OMDB_APIKEY = '6f5b80a6'
})

describe('GET /movies', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMSIsImlhdCI6MTcxNzIzOTAxMn0.ZnSsGPELz33-cbIP7zVHlZMzig3FGfT4fxP5syF-cmw'

  it('should responde with a 200 status code and Content-Type JSON', async () => {
    const response = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.header['content-type']).toBe('application/json; charset=utf-8')
  })

  it('should responde an array', async () => {
    const response = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.body).toBeInstanceOf(Array)
  })

  it('should return 401 if not authorized', async () => {
    const response = await request(app).get('/movies').send()
    expect(response.statusCode).toBe(401)
  })
}) // End Describe for GET /movies

describe('GET /movies/id', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMSIsImlhdCI6MTcxNzIzOTAxMn0.ZnSsGPELz33-cbIP7zVHlZMzig3FGfT4fxP5syF-cmw'
  const id = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3' // The Shawshank Redemption

  it('should responde with a 200 status code and Content-Type JSON', async () => {
    const response = await request(app)
      .get(`/movies/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.header['content-type']).toBe('application/json; charset=utf-8')
  })

  it('should response an object with properties', async () => {
    const response = await request(app)
      .get(`/movies/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

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
    const response = await request(app)
      .get(`/movies/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({ message: 'Movie not found' })
    // expect(response.body).toHaveProperty('message', 'Movie not found') // It's the same
  })

  it('should return 401 if not authorized', async () => {
    const response = await request(app)
      .get(`/movies/${id}`)
      .set('Authorization', 'Bearer fakeToken')
      .send()
    expect(response.statusCode).toBe(401)
  })
})

describe('POST /movies', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMSIsImlhdCI6MTcxNzIzOTAxMn0.ZnSsGPELz33-cbIP7zVHlZMzig3FGfT4fxP5syF-cmw'
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
      .post('/movies')
      .set('Authorization', `Bearer ${token}`)
      .send(newMovie)

    expect(response.status).toBe(201)
    expect(response.header['content-type']).toBe('application/json; charset=utf-8')
  })

  it('should create a new movie and return it', async () => {
    const response = await request(app)
      .post('/movies')
      .set('Authorization', `Bearer ${token}`)
      .send(newMovie)
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
    const response = await request(app)
      .post('/movies')
      .set('Authorization', `Bearer ${token}`)
      .send({})
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBeDefined()
    expect(response.body.error).toBeInstanceOf(Array)
  })

  it('should return 401 if not authorized', async () => {
    const response = await request(app)
      .post('/movies')
      .set('Authorization', 'Bearer fakeToken')
      .send(newMovie)
    expect(response.statusCode).toBe(401)
  })
})

describe('DELETE /movies/id', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMSIsImlhdCI6MTcxNzIzOTAxMn0.ZnSsGPELz33-cbIP7zVHlZMzig3FGfT4fxP5syF-cmw'

  it('should responde with a 200 status code and Content-Type JSON', async () => {
    const id = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3' // The Shawshank Redemption
    const response = await request(app)
      .delete(`/movies/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.header['content-type']).toBe('application/json; charset=utf-8')
  })

  it('should remove the movie from database', async () => {
    const id = 'c8a7d63f-3b04-44d3-9d95-8782fd7dcfaf' // The Dark Knight

    const responseBeforeDelete = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${token}`)
      .send()
    const countBefore = responseBeforeDelete.body.length

    await request(app)
      .delete(`/movies/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send() // Delete

    const responseAfterDelete = await request(app)
      .get('/movies')
      .set('Authorization', `Bearer ${token}`)
      .send()
    const countAfter = responseAfterDelete.body.length

    expect(countBefore).toBe(countAfter + 1)
  })

  it('should return 404 and Error Message when invalid ID', async () => {
    const id = 'fakeId'
    const response = await request(app)
      .delete(`/movies/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.statusCode).toBe(404)
    expect(response.body.message).toBeDefined()
  })

  it('should return 401 if not authorized', async () => {
    const id = 'dcdd0fad-a94c-4810-8acc-5f108d3b18c3'
    const response = await request(app)
      .delete(`/movies/${id}`)
      .set('Authorization', 'Bearer fakeToken')
      .send()
    expect(response.statusCode).toBe(401)
  })
})

describe('UPDATE /movies/id', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyMSIsImlhdCI6MTcxNzIzOTAxMn0.ZnSsGPELz33-cbIP7zVHlZMzig3FGfT4fxP5syF-cmw'

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

    const response = await request(app)
      .patch(`/movies/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedMovie)
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

    const response = await request(app)
      .patch(`/movies/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedMovie)
    const { title, year, director, duration, poster, genre, rate } = response.body
    expect(title).toBe(updatedMovie.title)
    expect(year).toBe(updatedMovie.year)
    expect(director).toBe(updatedMovie.director)
    expect(duration).toBe(updatedMovie.duration)
    expect(poster).toBe(updatedMovie.poster)
    expect(genre).toEqual(updatedMovie.genre)
    expect(rate).toBe(updatedMovie.rate)
  })

  it('should return 401 if not authorized', async () => {
    const id = '5ad1a235-0d9c-410a-b32b-220d91689a08'
    const response = await request(app)
      .patch(`/movies/${id}`)
      .set('Authorization', 'Bearer fakeToken')
      .send({})
    expect(response.statusCode).toBe(401)
  })
})

describe('GET /movies/external', () => {
  it('should responde with a 200 status code and Content-Type JSON', async () => {
    const title = 'river'
    const response = await request(app)
      .get(`/movies/external?title=${title}`)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.header['content-type']).toBe('application/json; charset=utf-8')
  })

  it('should return error when title is missing', async () => {
    const title = ''
    const response = await request(app)
      .get(`/movies/external?title=${title}`)
      .send()
    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({ error: 'Title required' })
  })

  it('should return an object', async () => {
    const title = 'river'
    const resMovie = await request(app)
      .get(`/movies/external?title=${title}`)
      .send()

    const {
      Title, Year, Rated, Released, Runtime, Genre, Director, Writer, Actors, Plot, Language, Country, Awards, Poster, Ratings,
      Metascore, imdbRating, imdbVotes, imdbID, Type, totalSeasons, Response
    } = resMovie.body

    expect(Title).toBeDefined()
    expect(Year).toBeDefined()
    expect(Rated).toBeDefined()
    expect(Released).toBeDefined()
    expect(Runtime).toBeDefined()
    expect(Genre).toBeDefined()
    expect(Director).toBeDefined()
    expect(Writer).toBeDefined()
    expect(Actors).toBeDefined()
    expect(Plot).toBeDefined()
    expect(Language).toBeDefined()
    expect(Country).toBeDefined()
    expect(Awards).toBeDefined()
    expect(Poster).toBeDefined()
    expect(Ratings).toBeInstanceOf(Array)
    expect(Metascore).toBeDefined()
    expect(imdbRating).toBeDefined()
    expect(imdbVotes).toBeDefined()
    expect(imdbID).toBeDefined()
    expect(Type).toBeDefined()
    expect(totalSeasons).toBeDefined()
    expect(Response).toBeDefined()
  })
})
