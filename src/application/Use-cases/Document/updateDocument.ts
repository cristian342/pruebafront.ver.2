import type { Document } from '../../../domain/models/Document'; // Importa la interfaz de tipo Documento
import type { DocumentRepository } from '../../../domain/repositories/DocumentRepository'; // Importa la interfaz del repositorio de documentos

/**
 * Caso de uso para actualizar un documento existente.
 *
 * Este caso de uso toma un objeto Documento completo (que ya debe tener un ID)
 * y lo guarda en el repositorio, sobrescribiendo la versión existente si el ID coincide.
 *
 * @param repo Repositorio de documentos para la persistencia.
 * @returns Una función asíncrona que toma el objeto Documento a actualizar
 *          y lo guarda en el repositorio.
 */
export const updateDocument = (repo: DocumentRepository) => {
  return async (document: Document) => {
    // Guarda el documento en el repositorio.
    // El método `save` del repositorio maneja si es una actualización o una inserción.
    await repo.save(document);
  };
};
