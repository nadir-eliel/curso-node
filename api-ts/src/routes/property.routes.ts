import { Router } from "express";

export const createPropertiesRouter = () => {
    const propertiesRouter: Router = Router()
    const propertiesController = new PropertiesController()
    propertiesRouter.get('/:id', propertiesController.getById)
    propertiesRouter.post('/', propertiesController.create)
}