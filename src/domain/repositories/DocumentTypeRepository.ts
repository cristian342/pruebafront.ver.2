import type { DocumentType } from '../models/DocumentType'; // Importa la interfaz de tipo DocumentType

/**
 * Interfaz que define el contrato para las operaciones de persistencia (CRUD)
 * de los Tipos de Documento.
 *
 * Esta interfaz es parte de la capa de Dominio y es agnóstica a la tecnología
 * de almacenamiento subyacente (ej. localStorage, base de datos, API REST).
 * Permite que la lógica de negocio dependa de una abstracción en lugar de una implementación concreta.
 */
export interface DocumentTypeRepository {
  /**
   * Recupera todos los tipos de documento.
   * @returns Una promesa que resuelve con un array de DocumentType.
   */
  getAll(): Promise<DocumentType[]>;

  /**
   * Recupera un tipo de documento específico por su identificador.
   * @param id El ID del tipo de documento a buscar.
   * @returns Una promesa que resuelve con el DocumentType encontrado o undefined si no existe.
   */
  getById(id: string): Promise<DocumentType | undefined>;

  /**
   * Guarda un tipo de documento. Si el tipo ya existe (mismo ID), lo actualiza;
   * de lo contrario, lo añade como uno nuevo.
   * @param documentType El objeto DocumentType a guardar o actualizar.
   * @returns Una promesa que resuelve cuando la operación se ha completado.
   */
  save(documentType: DocumentType): Promise<void>;

  /**
   * Elimina un tipo de documento por su identificador.
   * @param id El ID del tipo de documento a eliminar.
   * @returns Una promesa que resuelve cuando la operación se ha completado.
   */
  delete(id: string): Promise<void>;
}
