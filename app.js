// app.js

import express from 'express';
import cors from 'cors';


import userRoutes from './routes/users.js';
import incidenciasRoutes from './routes/incidencias.js';
import { initializeDatabase } from './database.js';

const app = express();



// Inicializar la base de datos
try {
  initializeDatabase();
  console.log('Base de datos inicializada correctamente');
} catch (error) {
  console.error('Error al inicializar la base de datos:', error);
  process.exit(1); // Salir del proceso si hay un error al inicializar la base de datos
}

app.use(cors()); //register middleware cors, para poder llamar api desde interfaces desacopladas
app.use(express.json());
app.use(express.static('public')); //para poder vistar las imágenes

// User routes
app.use('/users', userRoutes);
app.use('/incidencias', incidenciasRoutes);

// Ruta para manejar solicitudes GET a la raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a la API REST');
});

// Gestión de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});