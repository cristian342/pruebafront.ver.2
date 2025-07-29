import type { DocumentRepository } from '../../../domain/repositories/DocumentRepository'; // Importa la interfaz del repositorio de documentos

/**
 * Caso de uso para eliminar lógicamente un documento.
 *
 * Este caso de uso cambia el estado de un documento a 'deleted' en lugar de eliminarlo
 * permanentemente del almacenamiento. Esto permite la recuperación posterior del documento.
 *
 * @param repo Repositorio de documentos para la persistencia.
 * @returns Una función asíncrona que toma el ID del documento a "eliminar"
 *          y actualiza su estado en el repositorio.
 */
export const deleteDocument = (repo: DocumentRepository) => {
  return async (id: string): Promise<void> => {
    // Busca el documento por su ID en el repositorio.
    const documentToUpdate = await repo.findById(id);
    if (documentToUpdate) {
      // Si el documento existe, cambia su estado a 'deleted' (eliminado lógicamente).
      documentToUpdate.status = 'deleted';
      // Guarda el documento actualizado en el repositorio.
      await repo.save(documentToUpdate);
    }
  };
};
