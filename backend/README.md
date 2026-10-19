# Backend

Dependencias

El backend está desarrollado con Python y Django, y utiliza Django REST Framework para la construcción de la API REST y MySQL como sistema de gestión de base de datos.

## Requisitos previos

* Python instalado.
* MySQL Server instalado y en funcionamiento.
* Git para clonar el repositorio.

## Instalación

* Crear y activar el entorno virtual:

**python -m venv env**

* En Windows (CMD):

**env\Scripts\activate**

# Instalar las dependencias del proyecto:

**pip install -r requirements.txt**

* Configurar las variables de entorno en el archivo **.env**, incluyendo las credenciales de MySQL y el nombre de la base de datos local.

# Crear la base de datos en MySQL. Por ejemplo:

CREATE DATABASE sinertech_gestion_inventario
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

# Aplicar las migraciones para crear las tablas:

**python manage.py migrate**

# Iniciar el servidor de desarrollo:

**python manage.py runserver**

Por defecto, el servidor estará disponible en http://127.0.0.1:8000/.

