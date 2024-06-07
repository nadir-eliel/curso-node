/* eslint-disable indent */
import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from '../../db.js'

const connection = await mysql.createConnection(config)

export class UserModel {
  static async login ({ username, password }) {
    if (username) {
      const user = await connection
        .query('SELECT * from users WHERE username = ?', [username])
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
    const {
      username, password, firstName, lastName,
      dateOfBirth, email, address, phoneNumber
    } = input
    const [user] = await connection
      .query('SELECT * from users WHERE username = ?', [username])
    if (user.length > 0) {
      return null
    }

    const saltRounds = 1 // Recomended 10
    const encryptedPass = await bcrypt.hash(password, saltRounds)

    try {
      const insertResult = await connection
        .query(`INSERT INTO movies.users
            (username, password, firstName, lastName, dateOfBirth, email, address, phoneNumber)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?);`,
          [username, encryptedPass, firstName, lastName, dateOfBirth, email, JSON.stringify(address), phoneNumber])
      if (insertResult) {
        const { insertId } = insertResult[0]
        const [user] = await connection
          .query('SELECT * from users WHERE id = ?', [insertId])
        const { password, ...rest } = user[0]
        return rest
      }
    } catch (err) {
      console.error(err)
      return null
    }
  }

  static async delete (username) { }

  static getTotal () {
    return 0
  }
}
