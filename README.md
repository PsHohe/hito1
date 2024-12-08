# Proyecto Hitos Desafío latam
## Hito 3

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

5. Realizar la migración de las tablas (esto creará las tablas necesarias):
   ```bash
   npm run db:migrate
   ```

6. Poblar la base de datos con datos de prueba (opcional, pero creará datos para poder testear fácilmente, además de un usuario de ejemplo):
   ```bash
   npm run db:seed
   ```

7. Iniciar el servidor:
   ```bash
   npm start
   ```

El servidor se ejecutará en `http://localhost:3000`.

8. (Opcional) Acceder a la documentación Swagger en: `http://localhost:3000/api-docs`

9. Correr los tests:
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

* Mediante esta ruta se obtiene el token que será requerido en las rutas protegidas.

- **POST** `/api/v1/auth/register`
  - Descripción: Registra un nuevo usuario.
  - Cuerpo de la solicitud:
    ```json
    {
      "email": "tu_email@mail.com",
      "password": "tu_contraseña"
    }
    ```

### Estudiantes

- **GET** `/api/v1/students`
  - Descripción: Obtiene la lista de estudiantes. **(Protegido, requiere token Bearer)**

- **GET** `/api/v1/students/:id`
  - Descripción: Obtiene un estudiante por su ID. **(Protegido, requiere token Bearer)**

- **POST** `/api/v1/students`
  - Descripción: Crea un nuevo estudiante. **(Protegido, requiere token Bearer)**
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
  - Descripción: Actualiza un estudiante existente. **(Protegido)**
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
  - Descripción: Elimina un estudiante. **(Protegido)**


## Autenticación

Para acceder a los endpoints protegidos, debes incluir un token Bearer en el encabezado de autorización de la siguiente manera:

Authorization: Bearer <tu_token>

## Scripts Disponibles

- `npm start`: Inicia el servidor
- `npm run build`: Compila el proyecto
- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm run db:migrate`: Ejecuta las migraciones
- `npm run db:seed`: Puebla la base de datos
- `npm run db:up`: Levanta el contenedor Docker de PostgreSQL


## Notas

- *IMPORTANTE* Este proyecto cuenta con documentación Swagger, disponible en: /api-docs/ con la que se puede fácilmente probar los endpoints.
- La base de datos persiste mediante Docker postgres.
- Se incluye un usuario por defecto: email 'user@email.com' y contraseña 'password'
- El archivo .env está incluido en el repositorio para facilitar la prueba
- La API incluye rate limiting de 100 peticiones por IP cada 5 minutos



