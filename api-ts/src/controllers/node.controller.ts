export class NodeController {
  constructor(nodeModel: NodeModel) {
    this.nodeModel: NodeModel = nodeModel
  }

  getById = async (req: Request, res: Response) => {
    const { id } = req.params
    const node = await this.nodeModel.getById({ id })
    if (node) return res.json(node)

    res.status(404).json({ message: 'Movie not found' })
  }

  create = async (req: Request, res: Response) => {
    const result = validateMovie(req.body)

    if (!result.success) {
      return res.json({ error: JSON.parse(result.error.message) })
    }
    const newNode = await this.nodeModel.create({ input: result.data })
    return res.status(201).json(newNode)
  }
}