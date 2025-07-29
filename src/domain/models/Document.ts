/**
 * Interfaz que define la estructura de un Documento.
 * Esta interfaz asegura que todos los objetos de tipo Documento tengan
 * las propiedades especificadas con los tipos de datos correctos.
 */
export interface Document {
  id: string; // Identificador único del documento (ej. 'a1b2c3d4-e5f6-7890-1234-567890abcdef')
  name: string; // Nombre del documento (ej. 'Factura de Luz Enero')
  documentTypeId: string; // ID del tipo de documento al que pertenece (ej. '1' para 'Factura')
  creationDate: string; // Fecha de creación del documento en formato de cadena ISO (YYYY-MM-DD)
  fileContent: string; // Contenido del archivo codificado en Base64 (para almacenar archivos pequeños)
  fileName: string; // Nombre original del archivo (ej. 'factura_luz.pdf')
  fileType: string; // Tipo MIME del archivo (ej. 'application/pdf', 'image/jpeg')
  description: string; // Descripción detallada del documento
  status: 'active' | 'deleted'; // Estado del documento: 'active' (activo) o 'deleted' (eliminado lógicamente)
}
