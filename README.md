# Proyecto Hito-1

Este proyecto es parte de los "Hitos" de DesafíoLatam. Esn este caso es una API construida con Node.js y Express. A continuación se detallan los pasos para ejecutar el proyecto y los endpoints disponibles.

En este repositorio se encuentra un archivo PDF llamado 'Evidencias-Hito1.pdf' que incluye las imágenes solicitadas.

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

4. Iniciar el servidor:
   ```bash
   npm start
   ```

El servidor se ejecutará en `http://localhost:3000`.

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

## Autenticación

Para acceder a los endpoints protegidos, debes incluir un token Bearer en el encabezado de autorización de la siguiente manera:

Authorization: Bearer <tu_token>

## Notas

- Este proyecto mantiene la base de datos sólo en memoria. No se guardan los cambios entre ejecuciones.
- Cada vez que se inicia el servidor, la base de datos es sembrada con datos al azar, por lo que los estudiantes cambiarán.
- Viene siempre por defecto un usuario de email 'user@email.com' y contraseña 'password'.
- el archivo .env no fue incluido en el .gitignore y va con el repositorio para mayor facilidad. Al ser una app de ejemplo, no hay datos realmente sensibles.



