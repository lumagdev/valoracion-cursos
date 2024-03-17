# Establecer la imagen base
FROM node:20.11.1-alpine3.18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos necesarios
COPY ../../package.json ../../package-lock.json ./
COPY ../../vite.config.js ./
COPY ../../resources ./resources

# Instalar las dependencias
RUN npm install

# Exponer el puerto
EXPOSE 5173

# Establecer el comando por defecto para ejecutar la aplicación
CMD ["npm", "run", "dev"]