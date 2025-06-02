# PhotoShare

## Proyecto Integrado DAW

**PhotoShare** es una plataforma desarrollada como proyecto integrado del ciclo Superior de Desarrollo de Aplicaciones Web (DAW) por David Peña Fierro y Manuel Gómez Páez.

---

### Descripción

PhotoShare permite a los usuarios compartir, visualizar y gestionar fotografías de manera sencilla y segura. Es un proyecto académico cuyo objetivo principal es aplicar y poner en práctica los conocimientos adquiridos durante la formación en DAW.

---

### Características principales

- Subida, visualización y gestión de fotos
- Interfaz intuitiva y moderna
- Seguridad en el acceso y almacenamiento de imágenes
- Estructura modular y escalable

---

### Tecnologías utilizadas

- **Frontend:** JavaScript
- **Backend:** Java (Spring Boot)
- **Contenedores:** Docker
- **Otros:** Nginx, Maven, TypeScript

---

### Instalación y ejecución con Docker

Para facilitar la instalación y despliegue, PhotoShare utiliza Docker. Asegúrate de tener instalado [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/).

#### 1. Clona el repositorio

```bash
git clone https://github.com/davidpefierro/photoshare.git
cd photoshare
```

#### 2. Construye y lanza los contenedores

Si tienes un archivo `docker-compose.yml`, ejecuta:

```bash
docker compose up --build
```

Si no tienes Docker Compose y quieres construir los servicios por separado, puedes hacerlo así:

##### Frontend

```bash
docker build -f frontend.Dockerfile -t photoshare-frontend .
docker run -p 80:80 photoshare-frontend
```

##### Backend

```bash
docker build -f backend/Dockerfile -t photoshare-backend ./backend
docker run -p 8080:8080 photoshare-backend
```

> Ajusta los puertos si alguno está ocupado en tu sistema.

#### 3. Accede a la aplicación

- **Frontend:** [http://localhost](http://localhost)
- **Backend (API):** [http://localhost:8080](http://localhost:8080)

---

### Autores

- **David Peña Fierro**
- **Manuel Gómez Páez**

---

### Licencia

Proyecto académico para DAW. Uso educativo.

---