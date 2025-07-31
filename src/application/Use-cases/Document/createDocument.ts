import type { Document } from '../../../domain/models/Document'; // Importa la interfaz de tipo Documento
import type { DocumentRepository } from '../../../domain/repositories/DocumentRepository'; // Importa la interfaz del repositorio de documentos

/**
 * Caso de uso para crear un nuevo documento.
 *
 * Este es un "caso de uso" o "servicio de aplicación" que orquesta la lógica de negocio
 * para la creación de un documento. Recibe una instancia de `DocumentRepository`
 * para interactuar con la capa de persistencia.
 *
 * @param repo Repositorio de documentos para la persistencia.
 * @returns Una función asíncrona que toma los datos del documento (sin ID ni estado)
 *          y lo guarda en el repositorio.
 */
export const createDocument = (repo: DocumentRepository) => {
  return async (data: Omit<Document, 'id' | 'status'>) => {
    // Crea un nuevo objeto Documento, asignando un ID único y un estado inicial 'active'.
    const newDoc: Document = {
      ...data, // Copia todas las propiedades de 'data'
      id: crypto.randomUUID(), // Genera un ID único universal (UUID) para el documento
      creationDate: new Date().toISOString().split('T')[0], // Establece la fecha de creación actual en formato YYYY-MM-DD
      status: 'active' // Establece el estado inicial del documento como 'activo'
    };
    await repo.save(newDoc); // Guarda el nuevo documento en el repositorio
  };
};
