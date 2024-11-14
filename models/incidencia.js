import { getDB } from '../database.js';

export async function createIncidencia(creador_id, titulo, descripcion, imagen, ubicacion) {
    const db = getDB();
    const fecha_creacion = new Date().toISOString(); // Asegurarse de que la fecha esté en formato ISO

    const stmt = db.prepare(`
        INSERT INTO incidencias (creador_id, titulo, descripcion, fecha_creacion, estado, ruta_imagen, ubicacion)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(creador_id, titulo, descripcion, fecha_creacion, 'pendiente', imagen, ubicacion);
    return { id: info.lastInsertRowid, creador_id, titulo, descripcion, fecha_creacion, estado: 'pendiente', imagen, ubicacion };
}

export async function updateIncidencia(id,  titulo, descripcion, estado, imagen, ubicacion) {
    const db = getDB();

    const stmt = db.prepare(`
        UPDATE incidencias
        SET titulo = ?, descripcion = ?, estado = ?, ruta_imagen = ?, ubicacion = ?
        WHERE id = ?
    `);

    const result = stmt.run(titulo, descripcion, estado, imagen, ubicacion, id);
    if (result.changes === 0) {
        return null;
    }
    return { id, titulo, descripcion, estado, imagen, ubicacion };
}

export async function deleteIncidencia(id) {
    const db = getDB();

    const stmt = db.prepare(`
        DELETE FROM incidencias
        WHERE id = ? 
    `);

    const result = stmt.run(id);
    return result.changes > 0;
}

export async function findIncidenciaById(id) {
    const db = getDB();

    const stmt = db.prepare(`
        SELECT * FROM incidencias
        WHERE id = ?
    `);

    return stmt.get(id);
}

export function findIncidencias() {
    try {
        const db = getDB();
        const stmt = db.prepare(`
            SELECT * FROM incidencias
        `);
        const incidencias = stmt.all();
        return incidencias.length ? incidencias : [];
    } catch (error) {
        console.error('Error al obtener las incidencias:', error);
        throw error;
    }
}


export async function findCreadorIdByIncidenciaId(id) {
    const db = getDB();

    const stmt = db.prepare(`
        SELECT creador_id FROM incidencias
        WHERE id = ?
    `);

    const result = stmt.get(id);
    return result ? result.creador_id : null;
}

