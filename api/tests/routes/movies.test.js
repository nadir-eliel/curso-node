/* eslint-disable no-undef */
import app from '../../app.js'
import request from 'supertest'

// FIXME:
// Este test funciona, pero requiere que la app funcione.
// Es decir, que va a la base de datos, o lee el archivo JSON
// que se usa como fuente de los datos.
// Deberia usar un mock
describe('GET /movies', () => {
  it('should responde with a 200 status code', async () => {
    const response = await request(app).get('/movies').send()
    console.log(response)
    expect(response.statusCode).toBe(200)
  })
})
