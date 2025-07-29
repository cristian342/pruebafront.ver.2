import type { DocumentRepository } from '../../../domain/repositories/DocumentRepository'; // Importa la interfaz del repositorio de documentos

/**
 * Caso de uso para reactivar un documento.
 *
 * Este caso de uso cambia el estado de un documento de 'deleted' a 'active',
 * restaurándolo para que sea visible y operable en la aplicación.
 *
 * @param repo Repositorio de documentos para la persistencia.
 * @returns Una función asíncrona que toma el ID del documento a reactivar
 *          y actualiza su estado en el repositorio.
 */
export const reactivateDocument = (repo: DocumentRepository) => {
  return async (id: string): Promise<void> => {
    // Busca el documento por su ID en el repositorio.
    const documentToUpdate = await repo.findById(id);
    if (documentToUpdate) {
      // Si el documento existe, cambia su estado a 'active' (activo).
      documentToUpdate.status = 'active';
      // Guarda el documento actualizado en el repositorio.
      await repo.save(documentToUpdate);
    }
  };
};
