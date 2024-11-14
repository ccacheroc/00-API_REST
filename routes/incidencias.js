import express from 'express';
import * as incidencias from  '../controllers/incidencias-controller.js';
import { upload } from '../util/upload.js';    // Importar función de subida de archivos

import { authenticateToken } from '../util/auth.js';    // Importar función de autenticación y autorización

const router = express.Router();

// Obtener listado de incidencias: solo usuarios autenticados
router.get('/', authenticateToken, incidencias.dameListadoIncidencias);

// Crear una nueva incidencia: solo usuarios autenticados
router.post('/', authenticateToken,  upload.single('image'), incidencias.anyadeIncidencia);

// Editar una incidencia por id: solo administradores o creadores. 
router.put('/:id', authenticateToken, upload.single('image'), incidencias.modificaIncidencia);

// Eliminar una incidencia por id: solo administradores o creadores
router.delete('/:id', authenticateToken, incidencias.borraIncidencia);

// Obtener incidencia por id: solo usuarios autenticados
router.get('/:id', authenticateToken, incidencias.dameIncidencia);

export default router;
