# Config NodeJS with Typescript
 (source: https://blog.logrocket.com/how-to-set-up-node-typescript-express/)
- Node: 20.12.2
- npm init
- packages: (DOTENV no, ya que viene con Node 20 creo)

    ```npm i -E express```
- packages de desarrollo:

    ```npm i -DE typescript @types/express @types/node```

- Generar archivo de config de TS (tsconfig.json)
```npx tsc --init```
- Agregar la configuracion en tsconfig.json

```
{
  "compilerOptions": {
    ...
    "outDir": "./dist"
    ...
  }
}
```
- cambiar los archivos .js a **.ts** y obviamente agregar los tipos en las variables que correspondan

```
// Antes
app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

```
```
// Despues
import express, {Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT ?? 1234;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
```
- Para ejecutar un archivo .ts en NodeJS es necesario este script (no es necesario instalar ts-node):
    ``` npx ts-node src/index.ts ```
    (detalle: no me lee el archivo .env por lo que es probable que tenga que instalar dotenv)

- instalar ts-node
```npm i -DE ts-node```
- Actualizar el package.json con los siguientes scripts
```
 "scripts": {
    "build": "npx tsc",
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts"
  }
```

//FIXME: Aun no tengo claro por que se instala ts-node si al final hay que agregarlo al script ```npm run dev```