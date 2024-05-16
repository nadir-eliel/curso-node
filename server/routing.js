const http = require('node:http')

// Este require de un JSON se puede hacer solo en commonJS
const dittoJSON = require('./ditto.json')
const pikachuJSON = require('./pikachu.json')

const processRequest = (req, res) => {
  const { method, url } = req

  switch (method) {
    case 'GET':
      switch (url) {
        case '/pokemon/ditto':
          res.setHeader('Content-Type', 'application/json', 'charset=utf-8')
          return res.end(JSON.stringify(dittoJSON))
        case '/pokemon/pikachu':
          res.setHeader('Content-Type', 'application/json', 'charset=utf-8')
          return res.end(JSON.stringify(pikachuJSON))
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html', 'charset=utf-8')
          return res.end('<h1>404 Not Found</h1>')
      } // GET - switch
    case 'POST':
      switch (url) {
        case '/pokemon':{
          let body = ''
          req.on('data', chunk => { body += chunk.toString() })
          req.on('end', () => {
            const data = JSON.parse(body)
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' }) // otra forma de escribir Headers
            data.timestamp = Date.now()
            res.end(JSON.stringify(data))
          })
        }
          break
      } // POST - switch
      break
      // TODO:
    default:
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/html', 'charset=utf-8')
      return res.end('<h1>404 Not Found</h1>')
  }
}

const server = http.createServer(processRequest)

server.listen(3000, () => {
  console.log('Server listening on port 3000')
})
