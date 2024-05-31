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
}
