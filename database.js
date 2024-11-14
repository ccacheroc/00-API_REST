// database.js
import Database from 'better-sqlite3';

let db;

export function initializeDatabase() {
  db = new Database('./database.sqlite');

  // Inicializar la tabla de usuarios si no existe
  const initUsers = db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT,
      perfil TEXT DEFAULT 'simpatizante',
      ultima_cuota INTEGER,
      nombre TEXT NOT NULL,
      apellido1 TEXT NOT NULL,
      apellido2 TEXT,
      telefono_movil TEXT NOT NULL,
      calle TEXT,
      numero TEXT
    )
  `);

  initUsers.run();

  // Inicializar la tabla de incidencias si no existe
  const initIncidencias = db.prepare(`
    CREATE TABLE IF NOT EXISTS incidencias (
      id INTEGER PRIMARY KEY,
      creador_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      fecha_creacion TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'pendiente',
      fotos TEXT,
      ubicacion TEXT,
      FOREIGN KEY (creador_id) REFERENCES users(id)
    )
  `);

  initIncidencias.run();

  // Inicializar la tabla de comentarios si no existe
  const initComentarios = db.prepare(`
    CREATE TABLE IF NOT EXISTS comentarios (
      id INTEGER PRIMARY KEY,
      incidencia_id INTEGER NOT NULL,
      usuario_id INTEGER NOT NULL,
      comentario TEXT NOT NULL,
      fecha_comentario TEXT NOT NULL,
      FOREIGN KEY (incidencia_id) REFERENCES incidencias(id),
      FOREIGN KEY (usuario_id) REFERENCES users(id)
    )
  `);

  initComentarios.run();
}

export function getDB() {
  if (!db) {
    throw new Error('Base de datos no inicializada. Llama a initializeDatabase() primero.');
  }
  return db;
}