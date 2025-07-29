import type { Document } from '../models/Document'; // Importa la interfaz de tipo Documento

/**
 * Interfaz que define el contrato para las operaciones de persistencia (CRUD)
 * de los Documentos.
 *
 * Esta interfaz es parte de la capa de Dominio y es agnóstica a la tecnología
 * de almacenamiento subyacente (ej. localStorage, base de datos, API REST).
 * Permite que la lógica de negocio dependa de una abstracción en lugar de una implementación concreta.
 */
export interface DocumentRepository {
  /**
   * Recupera todos los documentos.
   * @returns Una promesa que resuelve con un array de Documento.
   */
  getAll(): Promise<Document[]>;

  /**
   * Busca un documento específico por su identificador.
   * @param id El ID del documento a buscar.
   * @returns Una promesa que resuelve con el Documento encontrado o null si no existe.
   */
  findById(id: string): Promise<Document | null>;

  /**
   * Guarda un documento. Si el documento ya existe (mismo ID), lo actualiza;
   * de lo contrario, lo añade como uno nuevo.
   * @param document El objeto Documento a guardar o actualizar.
   * @returns Una promesa que resuelve cuando la operación se ha completado.
   */
  save(document: Document): Promise<void>;

  /**
   * Elimina un documento por su identificador.
   * Nota: En esta aplicación, la eliminación es lógica (cambio de estado),
   * no una eliminación física del almacenamiento.
   * @param id El ID del documento a eliminar.
   * @returns Una promesa que resuelve cuando la operación se ha completado.
   */
  delete(id: string): Promise<void>;
}
