const path = require('node:path')
const fs = require('node:fs')

//Barra separadora de directorios segun SO
console.log(path.sep)

//unir rutas con path.join
const filePath = path.join('content', 'subfolder', 'archivo.txt')
console.log(filePath)

const base = path.basename('tmp/archivos/password.txt')
console.log(base);

const fileName = path.basename('tmp/archivos/password.txt', '.txt')
console.log(fileName);

const extension = path.extname('tmp/archivos/otro.password.txt')
console.log(extension);


fs.readdir('.', (error, files) => {
    if (error) {
        console.log('Error al leer el directorio', error)
        return
    }
    files.forEach(file => { 
        const filePath = path.join()
        console.log(file) })
})
