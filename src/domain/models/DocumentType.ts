/**
 * Interfaz que define la estructura de un Tipo de Documento.
 * Esta interfaz asegura que todos los objetos de tipo DocumentType tengan
 * las propiedades 'id' y 'name' con los tipos de datos especificados.
 */
export interface DocumentType {
  id: string; // Identificador único del tipo de documento (ej. '1', 'a1b2c3d4')
  name: string; // Nombre del tipo de documento (ej. 'Factura', 'Contrato', 'Informe')
}
