# Desarrollo de una Plataforma Digital para la Oferta y Demanda de Servicios Profesionales en Colonias Unidas

Este repositorio contiene el código fuente y la documentación técnica del sistema de software desarrollado como Trabajo Final de Grado para la Licenciatura en Análisis de Sistemas Informáticos de la Universidad Autónoma de Encarnación (UNAE).

La plataforma constituye una solución tecnológica diseñada para mitigar la informalidad laboral en la región de Colonias Unidas (Hohenau, Obligado y Bella Vista), centralizando e indexando perfiles de trabajadores independientes para permitir su vinculación directa con potenciales empleadores.

---

## 1. Arquitectura del Sistema

El sistema implementa el patrón arquitectónico **Modelo-Vista-Controlador (MVC)**, garantizando la separación de responsabilidades, la mantenibilidad del código y un desacoplamiento eficiente entre las capas de persistencia y presentación.

* **Tecnología del Backend:** Node.js como entorno de ejecución del lado del servidor, utilizando el framework Express para la gestión del enrutamiento HTTP y middlewares de seguridad.
* **Motor de Persistencia:** SQLite como sistema de gestión de bases de datos relacionales, proporcionando un almacenamiento portable, embebido y eficiente en disco local a través de transacciones SQL.
* **Tecnología del Frontend:** Interfaces dinámicas y responsivas construidas mediante HTML5, CSS3, JavaScript asíncrono y componentes lógicos del lado del cliente.

---

## 2. Estructura del Directorio del Proyecto

La organización del código fuente en el repositorio refleja fielmente las capas lógicas establecidas en el diseño arquitectónico:

```text
├── controllers/          # Lógica de negocio, controladores y procesamiento de peticiones.
├── database/             # Esquemas de inicialización, configuraciones y almacenamiento local.
│   ├── db.sqlite         # Base de datos relacional del entorno de desarrollo (excluida en producción).
│   └── schema.sql        # Script técnico de creación de tablas y restricciones relacionales.
├── docs/                 # Documentación técnica extendida y manuales de usuario del sistema.
│   ├── database.md       # Documentación exhaustiva del diccionario de datos y tablas de SQLite.
│   ├── casos_de_uso.md   # Especificaciones formales de los Casos de Uso (CU-01 a CU-04).
│   └── manual_usuario.md # Manual técnico-operativo de usuario final y administrador.
├── public/               # Recursos estáticos servidos de forma directa (CSS, imágenes, JS cliente).
├── routes/               # Definición técnica de rutas y mapeo de endpoints HTTP (GET / POST).
├── views/                # Motor de plantillas y vistas HTML que estructuran la interfaz de usuario.
├── .gitignore            # Directiva de exclusión de archivos temporales, módulos y persistencia real.
├── app.js                # Punto de entrada principal y configuración inicial del servidor Node.js.
└── package.json          # Manifiesto del proyecto, metadatos y declaración de dependencias.
