# Etapa de construcción con Maven y JDK
FROM eclipse-temurin:17-jdk-alpine as builder

# Instala Maven
RUN apk add --no-cache maven

WORKDIR /app

# Copy pom first, run go-offline, then copy source
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Crear carpeta de archivos
RUN mkdir -p /app/uploads

# Etapa de ejecución con solo el JRE
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copia el .jar generado desde el builder
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
