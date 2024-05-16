const http = require('node:http')

const port = process.env.PORT ?? 3000

const processRequest = (req, res) => {
  console.log('Request received', req.url)
  if (req.url === '/') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('Hola guachón')
  }
}

const server = http.createServer(processRequest)

// Server con puerto dinamico, busca cualquiera que esté libre
server.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`)
})
