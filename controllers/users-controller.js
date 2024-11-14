// controllers/userController.js

import { createUser, findUserByUsername, verifyUserCredentials } from '../models/User.js';
import { generateToken } from '../util/auth.js';

export async function signup(req, res) {
  const { username, password, nombre, apellido1, apellido2, telefono_movil, calle, numero } = req.body;
  // Validar que los campos requeridos no estén vacíos y sean strings
  if (!username || !password || !nombre || !apellido1 || !telefono_movil) {
    return res.status(400).json({ message: 'Faltan campos obligatorios', username, password, nombre, apellido1, telefono_movil });
  }
  // Validar que el email es válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username)) {
    return res.status(400).json({ message: 'El email no es válido' });
  }
  // Validar que la contraseña tiene más de seis caracteres
  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }
  // Validar que el teléfono móvil tiene 9 dígitos
  const telefonoRegex = /^\d{9}$/;
  if (!telefonoRegex.test(telefono_movil)) {
    return res.status(400).json({ message: 'El teléfono móvil debe tener 9 dígitos' });
  }
  try {
    // Validar que el email no existe
    const existingUser = findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    //creo un usuario con el perfil simpatizante (una vez paguen, los cambiaremos a mano)
    //me devuelve un objeto con los campos id, username y perfil
    const newUser = await createUser(username, password, nombre, apellido1, apellido2, telefono_movil, calle, numero);
    const token = generateToken(newUser); // Generar token JWT
    // Aquí se manejará el registro del usuario
    res.status(201).json({ message: 'Usuario registrado', user: newUser, token }); // Enviar token en la respuesta
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

export async function login(req, res) {
  const { username, password } = req.body;
  // (username, password) no deben estar vacíos y deben ser strings
  if (!username || !username.trim() || !password || !password.trim() ) {
    return res.status(400).json({ message: 'Debes introducir un usuario y contraseña válidos' });
  }
  try {
    console.log('Intentando verificar credenciales para:', username);
    const isValid = await verifyUserCredentials(username, password);
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    console.log('Credenciales verificadas, buscando usuario:', username);
    const user = await findUserByUsername(username); // Obtener usuario: id, username, perfil
    console.log('Usuario encontrado:', user);
    const token = generateToken(user); // Generar token JWT con id, username y perfil
    res.status(200).json({ message: 'Usuario autenticado', token }); // Enviar token en la respuesta
  } catch (error) {
    console.error('Error en el proceso de login:', error);
    res.status(500).json({ message: 'Error desconocido al autenticar el usuario', error: error.message });
  }
};