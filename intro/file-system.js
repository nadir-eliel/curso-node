const fileSystem = require('node:fs') // A partir de Node v16 se recomienda escribir node:fs
const fsPromises = require('node:fs/promises')
const path = require('node:path')
const { promisify } = require('node:util')
const logYellow = require('./utils')
/*
const stats = fileSystem.statSync('./data.txt')
console.log(
    stats.isFile(),
    stats.isDirectory(),
    stats.isSymbolicLink(),
    stats.size
)

const text = fileSystem.readFileSync('./data.txt', 'utf-8') // Devuelve un string
console.log('Read File Sync:', text, '\n')

//forma async de leer archivos
fileSystem.readFile('./data.txt', 'utf-8', (err, text) => {
    console.log('Callback: ', text, '\n')
}) // El callback se ejecuta una vez que termina de leer el archivo


// Async con Promises
fsPromises.readFile('./data.txt', 'utf-8')
    .then(text => logYellow(text))


// Creando una promesa a partir de Promisify (node:util)
const readFilePromise = promisify(fileSystem.readFile)
readFilePromise('./data.txt', 'utf-8')
    .then(data => console.log(data))
console.log('Separador del SO: ', path.sep)

    // Con async - Await

    /** El siguiente bloque de codigo no funciona asi como asi, va a dar un error:
     * "SyntaxError: await is only valid in async functions and the top level bodies of modules"
     * Entonces la solucion es usar "import { readFile} from 'node:fs' y cambiar la extension del archivo a .mjs"
     * 
     * Otra solucion es usar una IIFE (Inmediatly Invoked Function Expresion), tambien llamadas funciones autoinvocadas:
     * 
     * (
     * async () => 
     * {
     *  // Codigo a ejecutar
     * }
     * )() con estos dos ultimos parentesis se ejecuta lo definido dentro de la arrow funtion
     */

// ; (async () => {
//     const textAsync = await fsPromises.readFile('./data.txt', 'utf-8');
//     console.log('Version Async - Await: ', textAsync);
// })()


//En paralelo: pero por algun motivo no funciona
Promise.all([
    fsPromises.readFile('./data.txt', 'utf-8'),
    fsPromises.readFile('./cover_letter/cover-letter.txt', 'utf-8')
]).then(([data, coverLetter]) => {
    logYellow('Primero Data: '+ data);
    logYellow('Segundo CoverLetter: '+ coverLetter)
}).catch(error => console.log('error', error))