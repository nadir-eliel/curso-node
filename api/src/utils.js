import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

// Con esta funcion se puede importar directamente JSON
// Creamos un metodo require personalizado
export const readJSON = (path) => require(path)

/** En ES Modules no se puede importar directamente archivos JSON
 * import movies from './movies.json' with { type: 'json'} // en el futuro
 * Alternativas para importar JSON con ESModules
 * import fs from 'node:fs'
 * const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))
 */
