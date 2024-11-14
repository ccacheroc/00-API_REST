import { getDB } from '../database.js';
import bcrypt from 'bcryptjs';

/**
 * Crea un nuevo usuario en la base de datos.
 * @param {string} username - Nombre de usuario.
 * @param {string} password - Contraseña del usuario.
 * @param {string} nombre - Nombre del usuario.
 * @param {string} apellido1 - Primer apellido del usuario.
 * @param {string} apellido2 - Segundo apellido del usuario.
 * @param {string} telefono_movil - Teléfono móvil del usuario.
 * @param {string} calle - Calle del usuario.
 * @param {string} numero - Número de la calle del usuario.
 * @returns {Object} Objeto con el ID y nombre de usuario del nuevo usuario.
 */
export async function createUser(username, password, nombre, apellido1, apellido2, telefono_movil, calle, numero) {
  try {
    console.log('Intento insertar usuario en la bd');
    const db = getDB();
    const hashedPassword = await bcrypt.hash(password, 10); // Encriptar la contraseña
    const stmt = db.prepare(`
      INSERT INTO users (username, password, perfil, ultima_cuota, nombre, apellido1, apellido2, telefono_movil, calle, numero)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const perfil = 'simpatizante';
    const info = stmt.run(username, hashedPassword, perfil, null, nombre, apellido1, apellido2, telefono_movil, calle, numero);
    console.log(info);
    return { id: info.lastInsertRowid, username, perfil };
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error;
  }
}


/**
 * Busca un usuario por su nombre de usuario.
 * @param {string} username - Nombre de usuario a buscar.
 * @returns {Object|null} Objeto con los datos del usuario o null si no se encuentra.
 */
export function findUserByUsername(username) {
  try {
    const db = getDB();
    const stmt = db.prepare('SELECT id, username, password, perfil FROM users WHERE username = ?');
    const user = stmt.get(username);
    console.log('Usuario encontrado en la BD:', user);
    return user ? { id: user.id, username: user.username, password: user.password, perfil: user.perfil } : null;
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    throw error;
  }
}

/**
 * Verifica las credenciales del usuario.
 * @param {string} username - Nombre de usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {boolean} Verdadero si las credenciales son correctas, falso en caso contrario.
 */
export async function verifyUserCredentials(username, password) {
  try {
    const user = findUserByUsername(username);
    if (!user) {
      return false;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
  } catch (error) {
    console.error('Error al verificar las credenciales del usuario:', error);
    throw error;
  }
}

/**
 * Obtiene el perfil de un usuario por su ID.
 * @param {number} userId - ID del usuario.
 * @returns {Object|null} Objeto con los datos del perfil del usuario o null si no se encuentra.
 */
export function getUserProfileById(userId) {
  try {
    const db = getDB();
    const stmt = db.prepare('SELECT id, username, perfil FROM users WHERE id = ?');
    const user = stmt.get(userId);
    return user ? { id: user.id, username: user.username, perfil: user.perfil } : null;
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    throw error;
  }
}