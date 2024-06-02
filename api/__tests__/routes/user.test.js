import app from '../../app.js'
import request from 'supertest'
import { UserModel } from '../../src/models/user.js'

describe.skip('POST /login', () => {
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

describe('POST /create', () => {
  const newUser = {
    username: 'testuser',
    password: 'password',
    firstName: 'Nadir',
    lastName: 'Eliel',
    dateOfBirth: '1988-04-27',
    email: 'jejeje@user.com',
    address: {
      street: '158F Edgeware',
      city: 'Christchurch',
      country: 'New Zealand'
    },
    phoneNumber: '+64 6662154803'
  }

  it('should add a new item into database', async () => {
    const { username, ...rest } = newUser
    const user = { username: 'userOne', ...rest }
    const countUserBefore = UserModel.getTotal()
    const response = await request(app).post('/users').send(user)
    const countUserAfter = UserModel.getTotal()
    expect(response.statusCode).toBe(201)
    expect(countUserAfter).toBe(countUserBefore + 1)
    await UserModel.delete('userOne')
  })

  it('should return status code 200 and application/json', async () => {
    const { username, ...rest } = newUser
    const user = { username: 'userTwo', ...rest }
    const response = await request(app).post('/users').send(user)
    expect(response.statusCode).toBe(201)
    expect(response.header['content-type']).toBe('application/json; charset=utf-8')
    await UserModel.delete('userTwo')
  })

  it('should return error when username already exists', async () => {
    const { username, ...rest } = newUser
    const user = { username: 'userThree', ...rest }
    await request(app).post('/users').send(user)
    const duplicatedUser = await request(app).post('/users').send(user)

    expect(duplicatedUser.statusCode).toBe(400)
    expect(duplicatedUser.body.message).toBe('Error creating User') // Deberia decir "username already exists"
    await UserModel.delete('userThree')
  })

  // it('', async () => {

  // })
})
