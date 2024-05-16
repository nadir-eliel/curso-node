const express = require('express')
const dittoJSON = require('./ditto.json')
const pikachuJSON = require('./pikachu.json')

const app = express()
app.disable('x-powered-by')
const PORT = process.env.PORT ?? 1234

app.use((req, res, next) => {
  console.log('Middleware example')
  next()
})

app.use(express.json())

app.get('/pokemon/ditto', (req, res) => {
  res.status(200).json(dittoJSON)
})

app.get('/pokemon/pikachu', (req, res) => {
  res.status(200).json(pikachuJSON)
})

app.post('/pokemon', (req, res) => {
  let body = ''
  req.on('data', chunk => { body += chunk.toString() })

  req.on('end', () => {
    const data = JSON.parse(body)
    data.timestamp = Date.now()
    res.status(201).json(data)
  })
})

// DEFAULT RESPONSE
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
