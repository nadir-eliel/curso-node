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

# Database:
- Corre sobre una imagen docker de MySQL 8.4
- Script para crear la base de datos
    ``` CREATE DATABASE `rocket_lab` ```

- Script para el Dockerfile (opcional)
- Script para crear las tablas

``` 
   
CREATE TABLE rocket_lab.node (
	id INT auto_increment NOT NULL,
	name varchar(100) NOT NULL,
	created_at DATETIME NOT NULL,
	updated_at DATETIME NOT NULL,
	deleted_at DATETIME NULL,
	parent_id INT NULL,
	CONSTRAINT node_PK PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `property` (
  `key` varchar(100) NOT NULL,
  `value` decimal(10,3) NOT NULL,
  `node_id` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

    
    ```
- Script para insertar algunos valores en las tablas

- Agregamos TypeORM con el siguiente script:
    (fuente: https://typeorm.io/example-with-express)
``` npm i typeorm mysql reflect-metadata --save ```

- Agregamos estos dos validadores de la entidad para que no falle el insert 
```npm install class-validator class-transformer```

source: https://www.infoq.com/articles/typescript-mysql/


// NOTAS del curso de midudev de NodeJs - Typescript (https://www.youtube.com/watch?v=ZpY5KdGQvwI)
- usar ts-node-dev en lugar de ts-node (porque tiene un watch de cambios como nodemon)
- usar ts-standard como linter