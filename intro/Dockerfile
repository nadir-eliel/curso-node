# Utiliza una imagen base de Node.js
FROM node:lts

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json (o yarn.lock si estás utilizando Yarn)
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto en el que se ejecuta la aplicación (ajusta el número del puerto según tus necesidades)
EXPOSE 3000

# Comando para arrancar la aplicación (asegúrate de que coincida con el comando utilizado para iniciar la aplicación en tu package.json)
CMD ["npm", "start"]
