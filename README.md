# Proyecto Hitos Desafío latam
## Hito 6

En este hito, se ha implementado un sistema de chat en tiempo real utilizando Socket.io. A continuación se detallan las características principales:

### Características del Chat

- **Comunicación en tiempo real**: Implementación de Socket.io para permitir mensajería instantánea entre usuarios.
- **Autenticación integrada**: El sistema de chat utiliza el mismo sistema de autenticación JWT que la API REST.
- **Salas de chat**: Los usuarios pueden unirse a diferentes salas para mantener conversaciones separadas.
- **Interfaz de usuario**: Se ha creado una interfaz web simple en HTML.

### Cómo usar el chat

1. Accede a la aplicación en `http://localhost:3000`
2. Inicia sesión con tus credenciales (Usuario por defecto: user@email.com contraseña: password)
3. Una vez autenticado, podrás unirte a salas de chat y enviar mensajes
4. Los mensajes se muestran en tiempo real para todos los usuarios conectados a la misma sala

### Implementación técnica

- El servidor Socket.io se inicializa junto con el servidor HTTP en `src/index.ts`
- La configuración y lógica del socket se encuentra en `src/config/socket.ts`
- La interfaz de usuario y la lógica del cliente están en `src/public/index.html` y `src/public/chat.js`
- Se utiliza el middleware de autenticación para verificar los tokens JWT en las conexiones de socket


## Hitos previos y app en general

Este proyecto es parte de los "Hitos" de DesafíoLatam. Esn este caso es una API construida con Node.js y Express. A continuación se detallan los pasos para ejecutar el proyecto y los endpoints disponibles.

En este caso, decidí simular una base de datos con estudiante, ya que es cercano al área en la que trabajo.

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/PsHohe/hito1.git
   cd hito1
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

3. Construir el proyecto:
   ```bash
   npm run build
   ```

4. Levantar la base de datos con Docker (opcional, también puedes asignar una nueva DATABASE_URL en el archivo .env). Se requiere tener Docker instalado:
   ```bash
   docker compose up --d
   ```

5. Iniciar el servidor:
   ```bash
   npm start
   ```

El servidor se ejecutará en `http://localhost:3000`.

6. (Opcional) Acceder a la documentación Swagger en: `http://localhost:3000/api-docs`

7. Correr los tests:
   ```bash
   npm run test
   ```

## Endpoints

### Autenticación

- **POST** `/api/v1/auth/login`
  - Descripción: Inicia sesión y obtiene un token.
  - Cuerpo de la solicitud (en este caso, los datos del usuario que se crea por defecto):
    ```json
    {
      "email": "user@email.com",
      "password": "password"
    }
    ```

* Mediante esta ruta se obtiene la cookie con el token que será requerido en las rutas protegidas.

- **POST** `/api/v1/auth/register`
  - Descripción: Registra un nuevo usuario.
  - Cuerpo de la solicitud:
    ```json
    {
      "email": "tu_email@mail.com",
      "password": "tu_contraseña"
    }
    ```

- **POST** `/api/v1/auth/logout`
  - Descripción: Cierra la sesión.
  - No se requiere de un cuerpo.

- **GET** `/api/v1/auth/me`
  - Descripción: Obtiene el propio usuario. **(Protegido, requiere cookie con el token)**
  - Se debería obtener una respuesta similar a esta:
    ```json
    {
      "email": "user@email.com",
    }
    ```

### Estudiantes

- **GET** `/api/v1/students`
  - Descripción: Obtiene la lista de estudiantes. **(Protegido, requiere cookie con el token)**

- **GET** `/api/v1/students/:id`
  - Descripción: Obtiene un estudiante por su ID. **(Protegido, requiere cookie con el token)**

- **POST** `/api/v1/students`
  - Descripción: Crea un nuevo estudiante. **(Protegido, requiere cookie con el token)**
  - Cuerpo de la solicitud:
    ```json
    {
      "name": "Nombre",
      "lastName1": "Apellido1",
      "lastName2": "Apellido2",
      "dateOfBirth": "DD-MM-YYYY",
      "gender": "Género"
    }
    ```
- **PUT** `/api/v1/students/:id`
  - Descripción: Actualiza un estudiante existente. **(Protegido, requiere cookie con el token)**
  - Cuerpo de la solicitud:
    ```json
    {
      "name": "Nombre",
      "lastName1": "Apellido1",
      "lastName2": "Apellido2",
      "dateOfBirth": "DD-MM-YYYY",
      "gender": "Género"
    }
    ```

- **DELETE** `/api/v1/students/:id`
  - Descripción: Elimina un estudiante. **(Protegido, requiere cookie con el token)**


## Autenticación

Para acceder a los endpoints protegidos, tus solicitudes deben tener la cookie de autenticación creada con el endpoint `/api/v1/auth/login` antes descrito.

## Scripts Disponibles

- `npm start`: Inicia el servidor
- `npm run build`: Compila el proyecto
- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm run db:up`: Levanta el contenedor Docker de PostgreSQL


## Notas

- *IMPORTANTE* Este proyecto cuenta con documentación Swagger, disponible en: /api-docs/ con la que se puede fácilmente probar los endpoints.
- La base de datos está siendo reiniciada a cada inicio. En este momento, además, se crean algunos estudiantes y un usuario por defecto en un seeder automático.
- Se incluye un usuario por defecto: email 'user@email.com' y contraseña 'password'
- El archivo .env está incluido en el repositorio para facilitar la prueba
- La API incluye rate limiting de 100 peticiones por IP cada 5 minutos



