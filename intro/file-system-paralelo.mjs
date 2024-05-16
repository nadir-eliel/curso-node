
import { readFile } from 'node:fs/promises'
import logYellow from './utils.js';

Promise.all([
    readFile('./data.txt', 'utf-8'),
    readFile('./data.txt', 'utf-8')
]).then(([data, coverLetter]) => {
    logYellow('Primero Data: ' + data.toString());
    logYellow('Segundo CoverLetter: ' + coverLetter.toString())
}).catch(error => console.log('error', error))