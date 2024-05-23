// src/index.js
import express, { Express, Request, Response, json } from 'express';
import { myDataSource } from './app-data-source';
import { Property } from './entities/property.entity';
import { Nodes } from './entities/node.entity';
import { NodeDto } from './dto/node.dto'
import { validate } from 'class-validator';
import { PropertyDto } from './dto/property.dto';
// import { createNodesRouter } from './routes/node.routes';
// import { createPropertiesRouter } from './routes/property.routes';
// const dotenv = require('dotenv');
// dotenv.config();

// establish database connection
myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err)
  })

const app: Express = express();
const port = process.env.PORT ?? 3000;
app.use(json())

// TODO: probar este ejemplo minimalista y luego escalar
// TODO: crear un middleware que capture la rutas que no existen (e.g. GET /node)
// FIXME: acordate de los TRY-CATCH
app.get("/node/:id", async function (req: Request, res: Response) {
  const id = +req.params.id

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid id parameter" });
  }
  const node = await myDataSource.getRepository(Nodes).findOneBy({ id: id })

  if (!node) {
    return res.status(404).json({ message: 'Node not found' })
  }

  return res.json(node)
})

app.post("/node", async function (req: Request, res: Response) {

  const nodeDto: NodeDto = new NodeDto();
  const { name, parentId } = req.body
  nodeDto.name = name
  nodeDto.parentId = parentId ?? null

  const errors = await validate(nodeDto);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const node = await myDataSource.getRepository(Nodes).create(req.body)
  const results = await myDataSource.getRepository(Nodes).insert(node)
  const newId = results.generatedMaps[0].id
  const response = await myDataSource.getRepository(Nodes).findOneBy({ id: newId })
  return res.status(201).json(response)
})

// Dado un nodeID, buscar todas las propiedades
app.get("/property/:nodeId", async function (req: Request, res: Response) {
  const nodeId = +req.params.nodeId

  if (isNaN(nodeId)) {
    return res.status(400).json({ error: "Invalid Node ID" });
  }

  const properties = await myDataSource.getRepository(Property).findBy({ nodeId: +nodeId })

  if (!properties) {
    return res.status(404).json({ message: 'Node not found' })
  }
  return res.json(properties)
})

app.post("/property", async function (req: Request, res: Response) {
  const { key, value, nodeId } = req.body
  const propertyDto: PropertyDto = new PropertyDto()

  if (isNaN(nodeId)) {
    return res.status(400).json({ error: "Invalid Node ID" });
  }

  propertyDto.key = key
  propertyDto.value = value
  propertyDto.nodeId = nodeId

  const errors = await validate(propertyDto);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const node = await myDataSource.getRepository(Nodes).findOneBy({ id: nodeId })
  if (!node) return res.json({ error: 'Node not found' })

  const existingProperty = await myDataSource.getRepository(Property).findOneBy({ nodeId, key })

  if (existingProperty) return res.status(400).json({ error: 'Duplicated entry for Node-Property' })

  const property = await myDataSource.getRepository(Property).create(req.body)
  const results = await myDataSource.getRepository(Property).insert(property)

  const newProperty = await myDataSource.getRepository(Property).findOneBy({ nodeId, key })
  return res.status(201).json(newProperty)
})

// FIXME: aqui se va a modularizar un poquito
// app.use('/nodes', createNodesRouter());
// app.use('/properties', createPropertiesRouter())

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});