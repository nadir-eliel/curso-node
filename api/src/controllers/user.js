import { validateUser } from '../schemas/user.schema.js'

export class UserController {
  constructor ({ userModel }) {
    this.userModel = userModel
  }

  login = async (req, res) => {
    const result = validateUser(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const { username, password } = result.data
    const user = await this.userModel.login({ username, password })
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(401).json({ message: 'User or password incorrect' })
    }
  }
  create = async (req, res) => {
    const result = validateUser(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const user = await this.userModel.create(result.data)
    if (user) {
      res.status(201).json(user)
    } else {
      res.status(400).json({ message: 'Error creating User' })
    }
  }
}
