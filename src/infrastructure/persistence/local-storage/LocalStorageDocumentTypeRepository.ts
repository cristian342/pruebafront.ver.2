import type { DocumentType } from '../../../domain/models/DocumentType'; // Importa la interfaz de tipo DocumentType
import type { DocumentTypeRepository } from '../../../domain/repositories/DocumentTypeRepository'; // Importa la interfaz del repositorio

// Define la clave bajo la cual se almacenarán los tipos de documento en localStorage.
const LOCAL_STORAGE_KEY = 'documentTypes';

/**
 * Implementación concreta del DocumentTypeRepository que utiliza el almacenamiento local (localStorage)
 * del navegador para la persistencia de datos.
 * Esta clase cumple con el contrato definido por la interfaz DocumentTypeRepository.
 */
export class LocalStorageDocumentTypeRepository implements DocumentTypeRepository {
  /**
   * Recupera todos los tipos de documento almacenados en localStorage.
   * Si no hay datos, inicializa localStorage con un conjunto de tipos predeterminados.
   * @returns Una promesa que resuelve con un array de DocumentType.
   */
  async getAll(): Promise<DocumentType[]> {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY); // Intenta obtener los datos de localStorage
    if (data) {
      // Si hay datos, los parsea de JSON y asegura que el 'id' sea siempre un string
      const parsedData: DocumentType[] = JSON.parse(data);
      return parsedData.map(type => ({
        ...type,
        id: String(type.id) // Asegura que el ID sea un string
      }));
    } else {
      // Si no hay datos almacenados, define un conjunto de tipos de documento predeterminados.
      const defaultTypes: DocumentType[] = [
        { id: '1', name: 'Factura' },
        { id: '2', name: 'Contrato' },
        { id: '3', name: 'Informe' },
        { id: '4', name: 'Recibo' },
        { id: '5', name: 'Documento' },
      ];
      // Guarda los tipos predeterminados en localStorage para futuras cargas.
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultTypes));
      return defaultTypes; // Retorna los tipos predeterminados
    }
  }

  /**
   * Recupera un tipo de documento específico por su ID.
   * @param id El ID del tipo de documento a buscar.
   * @returns Una promesa que resuelve con el DocumentType encontrado o undefined si no existe.
   */
  async getById(id: string): Promise<DocumentType | undefined> {
    const documentTypes = await this.getAll(); // Obtiene todos los tipos de documento
    return documentTypes.find(dt => dt.id === id); // Busca el tipo por ID
  }

  /**
   * Guarda un tipo de documento. Si el tipo ya existe (mismo ID), lo actualiza; de lo contrario, lo añade.
   * @param documentType El objeto DocumentType a guardar o actualizar.
   * @returns Una promesa que resuelve cuando la operación se ha completado.
   */
  async save(documentType: DocumentType): Promise<void> {
    const documentTypes = await this.getAll(); // Obtiene la lista actual de tipos de documento
    // Busca el índice del tipo de documento si ya existe en la lista.
    const index = documentTypes.findIndex(dt => dt.id === documentType.id);
    if (index > -1) {
      documentTypes[index] = documentType; // Si existe, actualiza el objeto en su posición
    } else {
      documentTypes.push(documentType); // Si no existe, añade el nuevo tipo al final del array
    }
    // Guarda la lista completa (actualizada o con el nuevo elemento) de nuevo en localStorage.
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documentTypes));
  }

  /**
   * Elimina un tipo de documento por su ID.
   * @param id El ID del tipo de documento a eliminar.
   * @returns Una promesa que resuelve cuando la operación se ha completado.
   */
  async delete(id: string): Promise<void> {
    let documentTypes = await this.getAll(); // Obtiene la lista actual de tipos de documento
    // Filtra la lista para excluir el tipo de documento con el ID especificado.
    documentTypes = documentTypes.filter(dt => dt.id !== id);
    // Guarda la lista filtrada de nuevo en localStorage.
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documentTypes));
  }
}
