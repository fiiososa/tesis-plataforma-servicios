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
```
---

## 3. Requisitos del Sistema

Para el despliegue local o en servidor de la plataforma, se requieren los siguientes componentes de software:

* **Runtime:** Node.js (Versión 18.x LTS o superior recomendada).
* **Gestor de Paquetes:** npm (Incluido nativamente con la instalación de Node.js).
* **Motor de Base de Datos:** Motor SQLite3 embebido (Gestionado a través de dependencias de Node.js, sin necesidad de servidores de base de datos externos).

---

## 4. Instrucciones de Instalación y Despliegue Local

Siga la siguiente secuencia de comandos en la terminal de la línea de comandos para inicializar el entorno técnico de la aplicación:

### Paso 1: Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/fiiososa/tesis-plataforma-servicios.git)
cd tesis-plataforma-servicios
```
### Paso 2: Instalar las dependencias declaradas
Este comando descarga e instala de forma automatizada los módulos del backend (Express, SQLite3, Bcrypt para hashing de contraseñas, entre otros) especificados en el archivo `package.json`:

```bash
npm install
```
### Paso 3: Inicialización de la Base de Datos
Asegúrese de que el archivo `db.sqlite` se genere correctamente en el directorio correspondiente ejecutando el script de inicialización o levantando la aplicación por primera vez, lo cual creará de forma automática las tablas estructuradas a partir del esquema lógico (`schema.sql`).

### Paso 4: Ejecución del servidor web
Inicie el servidor local de Node.js para escuchar peticiones entrantes:

```bash
npm start
```
Una vez levantado el servicio, acceda a la plataforma desde cualquier navegador web utilizando la dirección URL local predeterminada: `http://localhost:3000`.

---

## 5. Casos de Uso Core Implementados

El sistema implementa y valida funcionalmente los siguientes requisitos lógicos del negocio:

* **CU-01: Registro de Usuario e Inserción de Datos Personales:** Módulo con persistencia en SQLite que implementa restricciones `UNIQUE` lógicas a nivel de base de datos para impedir la duplicidad de números de cédula e identidades de correo electrónico.
* **CU-02: Control de Acceso y Configuración Obligatoria de Perfil:** Middleware de seguridad que intercepta la sesión activa y restringe el acceso al ecosistema de la plataforma, obligando al usuario a parametrizar sus oficios, zonas geográficas de cobertura en Colonias Unidas y disponibilidad temporal antes de operar.
* **CU-03: Búsqueda de Profesionales y Conexión Externa:** Motor de consulta SQL indexado dinámico que provee filtrado por categorías, enlazando directamente al empleador con la API externa del protocolo de WhatsApp del profesional para una contratación expedita.
* **CU-04: Baja Voluntaria del Perfil con Justificación de Salida:** Proceso transaccional de borrado físico/lógico en la base de datos que libera las credenciales personales y recopila métricas de usabilidad para la administración del sistema.
