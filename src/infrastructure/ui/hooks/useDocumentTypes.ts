import { useState, useEffect } from 'react'; // Importa los hooks básicos de React
import { v4 as uuidv4 } from 'uuid'; // Importa la función para generar IDs únicos (UUIDs)
import type { DocumentType } from '../../../domain/models/DocumentType'; // Importa la interfaz de tipo DocumentType
// Importa la implementación del repositorio de tipos de documento que usa localStorage
import { LocalStorageDocumentTypeRepository } from '../../persistence/local-storage/LocalStorageDocumentTypeRepository';

// Crea una instancia del repositorio de tipos de documento.
// Esta instancia se usa para interactuar con la capa de persistencia (localStorage).
const documentTypeRepository = new LocalStorageDocumentTypeRepository();

/**
 * Hook personalizado para la gestión de tipos de documento.
 * Encapsula la lógica de negocio para obtener, añadir, actualizar y eliminar tipos de documento.
 */
export function useDocumentTypes() {
  // Estado local para almacenar la lista de tipos de documento.
  // Cuando este estado cambia, cualquier componente que use este hook se volverá a renderizar.
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);

  // useEffect: Se ejecuta después de cada renderizado del componente.
  // El array vacío `[]` como segundo argumento asegura que esta función se ejecute solo una vez,
  // cuando el componente que usa este hook se monta por primera vez (similar a componentDidMount).
  useEffect(() => {
    loadDocumentTypes(); // Carga los tipos de documento iniciales
  }, []);

  /**
   * Carga todos los tipos de documento desde el repositorio y actualiza el estado.
   */
  const loadDocumentTypes = async () => {
    const types = await documentTypeRepository.getAll(); // Obtiene todos los tipos de documento
    setDocumentTypes(types); // Actualiza el estado con los tipos obtenidos
  };

  /**
   * Añade un nuevo tipo de documento.
   * Genera un ID único para el nuevo tipo, lo guarda en el repositorio y luego recarga la lista.
   * @param name El nombre del nuevo tipo de documento.
   */
  const addDocumentType = async (name: string) => {
    const newType: DocumentType = {
      id: uuidv4(), // Genera un ID único para el nuevo tipo
      name, // Asigna el nombre proporcionado
    };
    await documentTypeRepository.save(newType); // Guarda el nuevo tipo en el almacenamiento
    await loadDocumentTypes(); // Recarga la lista para que la UI refleje el cambio
  };

  /**
   * Actualiza un tipo de documento existente.
   * Busca el tipo por su ID, actualiza su nombre si existe, lo guarda y recarga la lista.
   * @param id El ID del tipo de documento a actualizar.
   * @param name El nuevo nombre para el tipo de documento.
   */
  const updateDocumentType = async (id: string, name: string) => {
    const existingType = await documentTypeRepository.getById(id); // Busca el tipo existente por ID
    if (existingType) { // Si el tipo existe
      const updatedType = { ...existingType, name }; // Crea un nuevo objeto con el nombre actualizado
      await documentTypeRepository.save(updatedType); // Guarda el tipo actualizado
      await loadDocumentTypes(); // Recarga la lista para que la UI refleje el cambio
    }
  };

  /**
   * Elimina un tipo de documento por su ID.
   * Llama al método de eliminación del repositorio y luego recarga la lista.
   * @param id El ID del tipo de documento a eliminar.
   */
  const deleteDocumentType = async (id: string) => {
    await documentTypeRepository.delete(id); // Elimina el tipo de documento del almacenamiento
    await loadDocumentTypes(); // Recarga la lista para que la UI refleje el cambio
  };

  // Retorna el estado y las funciones para que los componentes puedan utilizarlos.
  return {
    documentTypes, // La lista actual de tipos de documento
    addDocumentType, // Función para añadir un tipo
    updateDocumentType, // Función para actualizar un tipo
    deleteDocumentType, // Función para eliminar un tipo
    loadDocumentTypes, // Función para recargar la lista (útil si se necesita refrescar manualmente)
  };
}
