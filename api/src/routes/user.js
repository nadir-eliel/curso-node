import { Router } from 'express'
import { UserController } from '../controllers/user.js'

export const createUserRouter = ({ userModel }) => {
  const userRouter = Router()
  const userController = new UserController({ userModel })

  userRouter.post('/', userController.create)
  userRouter.post('/login', userController.login)

  return userRouter
}
