import fs from 'node:fs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const users = JSON.parse(fs.readFileSync('./database/users.json', 'utf-8'))

export class UserModel {
  static async login ({ username, password }) {
    if (username) {
      const user = users.find(item => item.username === username)
      if (!user) {
        return null
      }
      if (password) {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
          const userForToken = {
            id: user.id,
            username: user.username
          }

          const token = jwt.sign(userForToken, process.env.TOKEN_SECRET)
          return {
            username: user.username,
            id: user.id,
            token
          }
        }
      }
    }
    return null
  }

  static async create (input) {
    const user = users.find(item => item.username === input.username)
    const nextId = users.length + 1
    if (user) {
      return null
    }

    const { password, ...rest } = input
    const saltRounds = 1 // Recomended 10
    const encryptedPass = await bcrypt.hash(password, saltRounds)

    const newUser = {
      id: nextId,
      password: encryptedPass,
      ...rest
    }
    try {
      users.push(newUser)
      fs.writeFileSync('./database/users.json', JSON.stringify(users))
      return { id: nextId, ...rest }
    } catch (err) {
      console.error(err)
      return null
    }
  }

  static async delete (username) {
    const filteredUsers = users.filter(item => item.username !== username)
    fs.writeFileSync('./database/users.json', JSON.stringify(filteredUsers))
  }

  static getTotal () {
    return users.length
  }
}
