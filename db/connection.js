const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta donde se guardará la base de datos local
const dbPath = path.resolve(__dirname, 'plataforma_servicios.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

// Crear tablas e infraestructura
db.serialize(() => {
  // Crear tabla usuarios si no existe
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        cedula TEXT NOT NULL,
        telefono TEXT NOT NULL,
        correo TEXT NOT NULL UNIQUE,
        contraseña TEXT NOT NULL,
        rol TEXT DEFAULT 'usuario'
    )
  `);

  // Crear tabla perfiles con todas sus columnas correspondientes
  db.run(`
    CREATE TABLE IF NOT EXISTS perfiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER UNIQUE,
        rol_trabajador INTEGER DEFAULT 0,
        rol_empleador INTEGER DEFAULT 0,
        oficios TEXT,
        horario TEXT,
        area TEXT,
        tarifa REAL
    )
  `, (err) => {
    if (!err) {
      // Por si la tabla ya existía sin las columnas, las agregamos de forma segura:
      db.run(`ALTER TABLE perfiles ADD COLUMN rol_trabajador INTEGER DEFAULT 0`, () => {});
      db.run(`ALTER TABLE perfiles ADD COLUMN rol_empleador INTEGER DEFAULT 0`, () => {});
    }
  });

  // Crear tabla usuarios_bloqueados si no existe
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios_bloqueados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        cedula TEXT UNIQUE,
        telefono TEXT,
        correo TEXT UNIQUE,
        motivo TEXT,
        comentario TEXT,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;