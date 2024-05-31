import app from '../../app.js'
import request from 'supertest'

describe.only('POST /login', () => {
  it('should return 200 and content-type JSON when login', async () => {
    const user = { username: 'user1', password: 'password1' }
    const response = await request(app).post('/login').send(user)
    expect(response.statusCode).toBe(200)
    expect(response.header['content-type']).toBe('application/json; charset=utf-8')
  })

  it('should return 401 when username or password incorrect', async () => {
    const user = { username: 'fakeUser', password: 'password1' }
    const response = await request(app).post('/login').send(user)
    expect(response.statusCode).toBe(401)
    expect(response.body.message).toBeDefined()
  })

  it('should return an user', async () => {
    const user = { username: 'user1', password: 'password1' }
    const response = await request(app).post('/login').send(user)
    const { username, firstName, lastName, dateOfBirth, email, phoneNumber } = response.body
    expect(username).toBe('user1')
    expect(firstName).toBe('Juan')
    expect(lastName).toBe('Perez')
    expect(dateOfBirth).toBe('1980-01-01')
    expect(email).toBe('juan.perez@example.com')
    expect(phoneNumber).toBe('+34 612 345 678')
  })
})
