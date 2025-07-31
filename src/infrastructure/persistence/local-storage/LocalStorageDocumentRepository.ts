import type { Document } from '../../../domain/models/Document.ts'; // Importa la interfaz de tipo Documento
import type { DocumentRepository } from '../../../domain/repositories/DocumentRepository.ts'; // Importa la interfaz del repositorio

// Define la clave bajo la cual se almacenarán los documentos en localStorage.
const STORAGE_KEY = 'documents';

/**
 * Implementación concreta del DocumentRepository que utiliza el almacenamiento local (localStorage)
 * del navegador para la persistencia de datos.
 * Esta clase cumple con el contrato definido por la interfaz DocumentRepository.
 */
export class LocalStorageDocumentRepository implements DocumentRepository {
  /**
   * Método privado para obtener todos los documentos directamente de localStorage.
   * Incluye manejo de errores para el parseo de JSON.
   * @returns Una promesa que resuelve con un array de Documento.
   */
  private async getRawAll(): Promise<Document[]> {
    const raw = localStorage.getItem(STORAGE_KEY); // Obtiene la cadena JSON de localStorage
    if (!raw) return []; // Si no hay datos, retorna un array vacío
    try {
      const documents: Document[] = JSON.parse(raw); // Intenta parsear la cadena JSON
      // Asegura que cada documento tenga una creationDate válida
      return documents.map(doc => ({
        ...doc,
        creationDate: doc.creationDate && !isNaN(new Date(doc.creationDate).getTime())
          ? doc.creationDate
          : new Date().toISOString().split('T')[0] // Asigna la fecha actual si es inválida o falta
      }));
    } catch (error) {
      console.error('Error parsing documents from localStorage:', error); // Registra el error si el parseo falla
      return []; // Retorna un array vacío en caso de error de parseo
    }
  }

  /**
   * Guarda un documento. Si el documento ya existe (mismo ID), lo actualiza; de lo contrario, lo añade.
   * @param document El objeto Documento a guardar o actualizar.
   * @returns Una promesa que resuelve cuando la operación se ha completado.
   */
  async save(document: Document): Promise<void> {
    const docs = await this.getRawAll(); // Obtiene la lista actual de documentos
    // Busca el índice del documento si ya existe en la lista.
    const index = docs.findIndex(d => d.id === document.id);
    if (index !== -1) {
      docs[index] = document; // Si existe, actualiza el objeto en su posición
    } else {
      docs.push(document); // Si no existe, añade el nuevo documento al final del array
    }
    // Guarda la lista completa (actualizada o con el nuevo elemento) de nuevo en localStorage.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  }

  /**
   * Recupera todos los documentos almacenados, independientemente de su estado.
   * @returns Una promesa que resuelve con un array de Documento.
   */
  async getAll(): Promise<Document[]> {
    let docs = await this.getRawAll(); // Obtiene todos los documentos sin procesar
    let changed = false;
    // Asegura que cada documento tenga una creationDate válida y la persiste si es necesario
    docs = docs.map(doc => {
      if (!doc.creationDate || isNaN(new Date(doc.creationDate).getTime())) {
        changed = true;
        return {
          ...doc,
          creationDate: new Date().toISOString().split('T')[0] // Asigna la fecha actual si es inválida o falta
        };
      }
      return doc;
    });

    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs)); // Persiste los cambios si alguna fecha fue corregida
    }
    return docs; // Retorna todos los documentos, con fechas corregidas si fue necesario
  }

  /**
   * Busca un documento específico por su ID.
   * @param id El ID del documento a buscar.
   * @returns Una promesa que resuelve con el Documento encontrado o null si no existe.
   */
  async findById(id: string): Promise<Document | null> {
    const docs = await this.getRawAll(); // Obtiene todos los documentos
    return docs.find(doc => doc.id === id) || null; // Busca el documento por ID y retorna null si no lo encuentra
  }

  /**
   * Este método no realiza ninguna operación, ya que la "eliminación" de documentos
   * se maneja como un cambio de estado (eliminación lógica) en el caso de uso,
   * no como una eliminación física del almacenamiento.
   * @param id El ID del documento a "eliminar" (su estado se cambia en el caso de uso).
   * @returns Una promesa que resuelve cuando la operación se ha completado (inmediatamente).
   */
  async delete(id: string): Promise<void> {
    // No se necesita ninguna operación aquí, ya que el caso de uso maneja el cambio de estado a 'deleted'.
  }
}
