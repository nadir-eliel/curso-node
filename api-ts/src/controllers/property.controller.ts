export class PropertiesController {
  constructor ({ propertyModel }) {
    this.propertyModel = propertyModel
  }

  create = async (req: Request, res: Response) => {
    const result = validateMovie(req.body)

    if (!result.success) {
      return await res.json({ error: JSON.parse(result.error.message) })
    }
    const newProperty = await this.properyModel.create({ input: result.data })
    res.status(201).json(newProperty) // FIXME: por que acá no usa return?
  }
}
