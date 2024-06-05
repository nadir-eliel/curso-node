import { Router } from 'express'
import { NodeController } from '../controllers/node.controller'

// FIXME: tal vez tengo que inyectar aqui la conexion con la bbdd
export const createNodesRouter = () => {
  const nodesRouter: Router = Router()
  const nodesController = new NodeController()
  nodesRouter.get('/:id', nodesController.getById)
  nodesRouter.post('/', nodesController.create)
}
