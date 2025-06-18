# Usa la imagen oficial de MySQL como base
FROM mysql:8.0

# Copia el archivo SQL al contenedor
COPY PhotoShare.sql /docker-entrypoint-initdb.d/PhotoShare.sql

# Establece las variables de entorno necesarias
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=photoshare

# Expone el puerto de MySQL
EXPOSE 3306