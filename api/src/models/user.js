import fs from 'node:fs'
import bcrypt from 'bcrypt'
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
          return user
        }
      }
    }
    return null
  }
}
