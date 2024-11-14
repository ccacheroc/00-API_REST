import { createIncidencia, updateIncidencia, deleteIncidencia, findCreadorIdByIncidenciaId, findIncidenciaById, findIncidencias} from '../models/incidencia.js';

async function authorizeIncidenciasCreadorOrAdmin(req) {
    const user = req.user;
    const incidenciaId = req.params.id;
    
    const creadorId = await findCreadorIdByIncidenciaId(incidenciaId);
    
    if (!creadorId) {
        console.log('Incidencia no encontrada en la BD');
        return false; // incidencia no encontrada en la BD
    }

    if (user.perfil === 'admin' || user.id === creadorId) {
        return true; 
    } else {
        console.log(`No tienes permisos para realizar esta acción sobre incidencias. User ID: ${user.id}, Creador ID: ${creadorId}, Perfil: ${user.perfil}`);
        return false;
    }
}

export async function anyadeIncidencia(req, res) {
    const { titulo, descripcion, ubicacion } = req.body;
    const image = req.file; // image.filename contendrá la ruta de ese image file.

    const creador_id = req.user.id; // Asumiendo que el id del usuario está en req.user
    const perfil_usuario = req.user.perfil; // Asumiendo que el perfil del usuario está en req.user

    // Verificar si el perfil del usuario es 'simpatizante' (se ha registrado pero aún no ha pagado)
    if (perfil_usuario === 'simpatizante') {
        return res.status(403).json({ message: 'Aún no se ha registrado tu pago, y por tanto no tienes permisos para crear una incidencia' });
    }

    // Validar que los campos requeridos no estén vacíos y no sean solo espacios en blanco
    if (!titulo || !descripcion || !titulo.trim() || !descripcion.trim()) {
        return res.status(400).json({ message: 'Título y descripción son campos obligatorios' });
    }

    try {
        const newIncidencia = await createIncidencia(creador_id, titulo.trim(), descripcion.trim(), image.filename, ubicacion);
        res.status(201).json({ message: 'Incidencia creada', incidencia: newIncidencia });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la incidencia', error });
    }
}

export async function modificaIncidencia(req, res) {
    const { id } = req.params;
    const { titulo, descripcion, estado, fotos, ubicacion } = req.body;
    const creador_id = req.user.id; // Asumiendo que el id del usuario está en req.user
    const perfil_usuario = req.user.perfil; 
    const image = req.file; // image.filename contendrá la ruta de ese image file.
   
    const es_autorizado = await authorizeIncidenciasCreadorOrAdmin(req);
    if (!es_autorizado) {
        return res.status(403).json({ message: 'No tienes permisos para realizar esta acción sobre incidencias' });
    }   
    // Validar que los campos requeridos no estén vacíos y sean strings
    if (!titulo || !descripcion || !titulo.trim() || !descripcion.trim()) {
        return res.status(400).json({ message: 'Título y descripción son campos obligatorios' });
    }

    try {
        const updatedIncidencia = await updateIncidencia(id, titulo, descripcion, estado, image.filename, ubicacion);
        if (!updatedIncidencia) {
            return res.status(404).json({ message: 'Incidencia no encontrada o no tienes permiso para editarla' });
        }
        res.json({ message: `Incidencia con id ${id} editada`, incidencia: updatedIncidencia });
    } catch (error) {
        res.status(500).json({ message: 'Error al editar la incidencia', error: error.message || error });
    }
}

export async function borraIncidencia(req, res) {
    const { id } = req.params;

    const es_autorizado = await authorizeIncidenciasCreadorOrAdmin(req);
    if (!es_autorizado) {
        return res.status(403).json({ message: 'No tienes permisos para realizar esta acción sobre incidencias' });
    }   

    try {
        const deleted = await deleteIncidencia(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Incidencia no encontrada o no tienes permiso para eliminarla' });
        }
        res.json({ message: `Incidencia con id ${id} eliminada` });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la incidencia', error:error.message || error });
    }
}

export async function dameListadoIncidencias(req, res) {
    try {
        const incidencias = await findIncidencias();
        res.json({ incidencias: incidencias || [] });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener listado de incidencias', error });
    }
}

export async function dameIncidencia(req, res) {   
    const { id } = req.params;
    try {
        const incidencia = await findIncidenciaById(id);
        if (!incidencia) {
            return res.status(404).json({ message: 'Incidencia no encontrada' });
        }
        res.json({ incidencia });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la incidencia', error });
    }
}

