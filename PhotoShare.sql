CREATE DATABASE IF NOT EXISTS photoshare;
USE photoshare;

-- Tabla Usuarios
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    fecha_registro DATETIME NOT NULL,
    rol ENUM('Usuario', 'Administrador') NOT NULL,
    estado ENUM('Activo', 'Bloqueado') NOT NULL
);

-- Tabla Fotografias
CREATE TABLE fotografia (
    id_foto INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha_publicacion DATETIME NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla Comentarios
CREATE TABLE comentario (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_foto INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_publicacion DATETIME NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_foto) REFERENCES fotografia(id_foto)
);

-- Tabla Me gusta
CREATE TABLE me_gusta (
    id_like INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_foto INT NOT NULL,
    fecha_like DATETIME NOT NULL,
    UNIQUE (id_usuario, id_foto),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_foto) REFERENCES fotografia(id_foto)
);

-- Tabla Mensajes
CREATE TABLE mensaje (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    id_remitente INT NOT NULL,
    id_destinatario INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_envio DATETIME NOT NULL,
    estado ENUM('Visto', 'No_visto') NOT NULL,
    FOREIGN KEY (id_remitente) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_destinatario) REFERENCES usuario(id_usuario)
);

-- Tabla Bloqueos
CREATE TABLE bloqueo (
    id_bloqueo INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_bloqueado INT NOT NULL,
    id_admin INT NOT NULL,
    fecha_bloqueo DATETIME NOT NULL,
    motivo TEXT,
    FOREIGN KEY (id_usuario_bloqueado) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_admin) REFERENCES usuario(id_usuario)
);

-- Tabla Reportes
CREATE TABLE reporte (
    id_reporte INT AUTO_INCREMENT PRIMARY KEY,
    id_reportador INT NOT NULL,
    id_denunciado INT NOT NULL,
    tipo_contenido ENUM('Foto', 'Comentario', 'Mensaje') NOT NULL,
    motivo TEXT NOT NULL,
    fecha_reporte DATETIME NOT NULL,
    estado ENUM('Pendiente', 'Resuelto') NOT NULL,
    id_foto INT NULL,
    FOREIGN KEY (id_reportador) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_denunciado) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_foto) REFERENCES fotografia(id_foto)
);

-- Tabla Notificaciones
CREATE TABLE notificacion (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    estado ENUM('Leido', 'No_leido') NOT NULL,
    fecha_envio DATETIME NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Tabla Sesiones
CREATE TABLE sesion (
    id_sesion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    direccion_ip VARCHAR(45) NOT NULL,
    navegador VARCHAR(255) NOT NULL,
    inicio_sesion DATETIME NOT NULL,
    cierre_sesion DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);