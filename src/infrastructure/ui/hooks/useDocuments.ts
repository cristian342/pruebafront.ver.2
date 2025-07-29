import { useEffect, useState } from 'react'; // Importa los hooks básicos de React
import type { Document } from '../../../domain/models/Document.ts'; // Importa la interfaz de tipo Documento
// Importa la implementación del repositorio de documentos que usa localStorage
import { LocalStorageDocumentRepository } from '../../persistence/local-storage/LocalStorageDocumentRepository';
// Importa los casos de uso (funciones de lógica de negocio) para documentos
import { createDocument } from '../../../application/Use-cases/Document/createDocument';
import { updateDocument as updateDocUseCase } from '../../../application/Use-cases/Document/updateDocument';
import { deleteDocument as deleteDocUseCase } from '../../../application/Use-cases/Document/deleteDocument';
import { reactivateDocument as reactivateDocUseCase } from '../../../application/Use-cases/Document/reactivateDocument';
import { ResultadoTipo } from '../components/Modals/Modalmessage.types'; // Importa el tipo ResultadoTipo

// Crea una instancia del repositorio de documentos.
const repo = new LocalStorageDocumentRepository();
// Inicializa los casos de uso, inyectando el repositorio como dependencia.
// Esto sigue el patrón de Inversión de Control/Inyección de Dependencias.
const create = createDocument(repo);
const update = updateDocUseCase(repo);
const remove = deleteDocUseCase(repo);
const reactivate = reactivateDocUseCase(repo);

/**
 * Hook personalizado para la gestión de documentos.
 * Encapsula la lógica de negocio para obtener, añadir, actualizar, eliminar (lógicamente)
 * y reactivar documentos, interactuando con los casos de uso definidos.
 */
export const useDocuments = () => {
  // Estado local para almacenar la lista de documentos.
  // Cuando este estado cambia, cualquier componente que use este hook se volverá a renderizar.
  const [documents, setDocuments] = useState<Document[]>([]);
  // Estados para controlar el modal de mensaje
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ResultadoTipo>('aviso');
  const [modalMessage, setModalMessage] = useState('');

  /**
   * Carga todos los documentos desde el repositorio y actualiza el estado.
   */
  const loadDocuments = async () => {
    const updated = await repo.getAll(); // Obtiene todos los documentos
    setDocuments(updated); // Actualiza el estado con los documentos obtenidos
  };

  // Función para abrir el modal con un tipo y mensaje específicos
  const openModal = (type: ResultadoTipo, message: string) => {
    setModalType(type);
    setModalMessage(message);
    setModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalOpen(false);
  };

  // useEffect: Se ejecuta después de cada renderizado del componente.
  // El array vacío `[]` como segundo argumento asegura que esta función se ejecute solo una vez,
  // cuando el componente que usa este hook se monta por primera vez.
  useEffect(() => {
    loadDocuments(); // Carga los documentos iniciales
  }, []);

  /**
   * Añade un nuevo documento.
   * Llama al caso de uso `create` y luego recarga la lista de documentos.
   * @param doc Los datos del nuevo documento (sin id ni status, ya que se generan en el caso de uso).
   */
  const addDocument = async (doc: Omit<Document, 'id' | 'status'>) => {
    try {
      await create(doc); // Ejecuta el caso de uso para crear el documento
      await loadDocuments(); // Recarga la lista para que la UI refleje el cambio
      openModal('exito', 'Documento añadido con éxito.');
    } catch (error) {
      console.error('Error al añadir documento:', error);
      openModal('error', 'Error al añadir documento.');
    }
  };

  /**
   * Actualiza un documento existente.
   * Llama al caso de uso `update` y luego recarga la lista de documentos.
   * @param doc El objeto Documento con los datos actualizados.
   */
  const updateDocument = async (doc: Document) => {
    try {
      await update(doc); // Ejecuta el caso de uso para actualizar el documento
      await loadDocuments(); // Recarga la lista para que la UI refleje el cambio
      openModal('exito', 'Documento actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar documento:', error);
      openModal('error', 'Error al actualizar documento.');
    }
  };

  /**
   * Elimina lógicamente un documento (cambia su estado a 'deleted').
   * Llama al caso de uso `remove` y luego recarga la lista de documentos.
   * @param id El ID del documento a eliminar.
   */
  const deleteDocument = async (id: string) => {
    try {
      await remove(id); // Ejecuta el caso de uso para eliminar el documento
      await loadDocuments(); // Recarga la lista para que la UI refleje el cambio
      openModal('advertencia', 'Documento eliminado lógicamente.');
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      openModal('error', 'Error al eliminar documento.');
    }
  };

  /**
   * Reactiva un documento previamente eliminado (cambia su estado a 'active').
   * Llama al caso de uso `reactivate` y luego recarga la lista de documentos.
   * @param id El ID del documento a reactivar.
   */
  const reactivateDocument = async (id: string) => {
    try {
      await reactivate(id); // Ejecuta el caso de uso para reactivar el documento
      await loadDocuments(); // Recarga la lista para que la UI refleje el cambio
      openModal('aviso', 'Documento reactivado con éxito.');
    } catch (error) {
      console.error('Error al reactivar documento:', error);
      openModal('error', 'Error al reactivar documento.');
    }
  };

  // Retorna el estado y las funciones para que los componentes puedan utilizarlos.
  return {
    documents, // La lista actual de documentos
    addDocument, // Función para añadir un documento
    updateDocument, // Función para actualizar un documento
    deleteDocument, // Función para eliminar un documento
    reactivateDocument, // Función para reactivar un documento
    loadDocuments, // Función para recargar la lista (útil si se necesita refrescar manualmente)
    modalOpen, // Estado de apertura del modal
    modalType, // Tipo de mensaje del modal
    modalMessage, // Mensaje del modal
    closeModal, // Función para cerrar el modal
  };
};
