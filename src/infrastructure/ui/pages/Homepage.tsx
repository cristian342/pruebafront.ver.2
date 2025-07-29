import React, { useState } from 'react';
import { DocumentForm } from '../components/DocumentForm'; // Componente para el formulario de documentos (subir/editar)
import { DocumentList } from '../components/DocumentList'; // Componente para la lista de documentos
// Importa hooks personalizados para la lógica de negocio de documentos y tipos de documento.
import { useDocuments } from '../hooks/useDocuments';
import { useDocumentTypes } from '../hooks/useDocumentTypes';
// Importa componentes de Material-UI para la interfaz de usuario.
import {
    Grid, // Sistema de cuadrícula para diseño responsivo
    Box, // Componente utilitario para envolver elementos y aplicar estilos
    Typography, // Componente para mostrar texto
    Dialog, // Componente de diálogo modal
    DialogTitle, // Título del diálogo
    DialogContent, // Contenido del diálogo
    DialogActions, // Acciones (botones) del diálogo
    Button, // Botón interactivo
    Container, // Limita el ancho del contenido
} from '@mui/material';
import type { Document } from '../../../domain/models/Document'; // Importa la interfaz de tipo Documento
import ModalMensaje from '../../../domain/Modals/Modalmessage'; // Importa el componente ModalMensaje
import { ResultadoTipo } from '../../../domain/Modals/Modalmessage.types'; // Importa el tipo ResultadoTipo

/**
 * Página principal de la aplicación para la gestión de documentos.
 * Permite subir, listar, ver, editar, eliminar (lógicamente) y reactivar documentos.
 */
export function HomePage() {
    // Obtiene los documentos y las funciones de gestión del hook useDocuments.
    const { documents, addDocument, updateDocument, deleteDocument, reactivateDocument } = useDocuments();
    // Obtiene los tipos de documento del hook useDocumentTypes (necesario para el formulario y la lista).
    const { documentTypes } = useDocumentTypes();

    // Estados locales para controlar la interfaz de usuario y los datos de los diálogos.
    const [editingDocument, setEditingDocument] = useState<Document | null>(null); // Documento que se está editando
    const [viewingDocument, setViewingDocument] = useState<Document | null>(null); // Documento que se está visualizando
    const [openEditDialog, setOpenEditDialog] = useState(false); // Controla la visibilidad del diálogo de edición
    const [openViewDialog, setOpenViewDialog] = useState(false); // Controla la visibilidad del diálogo de visualización
    const [modalState, setModalState] = useState<{
        open: boolean;
        resultado: ResultadoTipo;
        mensaje: string;
    }>({
        open: false,
        resultado: 'info',
        mensaje: '',
    });

    /**
     * Maneja la acción de editar un documento.
     * @param doc El documento a editar.
     */
    const handleEdit = (doc: Document) => {
        setEditingDocument(doc); // Establece el documento a editar en el estado
        setOpenEditDialog(true); // Abre el diálogo de edición
    };

    /**
     * Maneja la acción de ver los detalles de un documento.
     * @param doc El documento a visualizar.
     */
    const handleView = (doc: Document) => {
        setViewingDocument(doc); // Establece el documento a visualizar en el estado
        setOpenViewDialog(true); // Abre el diálogo de visualización
    };

    /**
     * Maneja la acción de eliminar lógicamente un documento.
     * Muestra una confirmación antes de proceder.
     * @param id El ID del documento a eliminar.
     */
    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este documento?')) {
            await deleteDocument(id); // Llama a la función de eliminación del hook
        }
    };

    /**
     * Maneja la acción de reactivar un documento previamente eliminado.
     * @param id El ID del documento a reactivar.
     */
    const handleReactivate = async (id: string) => {
        await reactivateDocument(id); // Llama a la función de reactivación del hook
    };

    /**
     * Maneja la acción de descargar un archivo adjunto.
     * Crea un enlace temporal para la descarga del archivo base64.
     * @param doc El documento cuyo archivo se va a descargar.
     */
    const handleDownload = (doc: Document) => {
        if (doc.fileContent && doc.fileName && doc.fileType) {
            // Decodifica el contenido base64 del archivo
            const base64Data = doc.fileContent.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteArray = new Uint8Array([...byteCharacters].map(c => c.charCodeAt(0)));
            const blob = new Blob([byteArray], { type: doc.fileType });

            // Crea un enlace temporal para la descarga
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = doc.fileName; // Establece el nombre del archivo para la descarga
            document.body.appendChild(link);
            link.click(); // Simula un clic en el enlace para iniciar la descarga
            document.body.removeChild(link); // Elimina el enlace temporal
            URL.revokeObjectURL(link.href); // Libera la URL del objeto
        } else {
            alert('No hay archivo adjunto para descargar.');
        }
    };

    /**
     * Maneja el envío del formulario de actualización de documento.
     * Se llama cuando se guarda un documento editado.
     * @param docData Los datos actualizados del documento (sin id ni status).
     */
    const handleUpdateSubmit = async (docData: Omit<Document, 'id' | 'status'>) => {
        if (editingDocument) {
            // Combina los datos existentes del documento con los datos actualizados del formulario.
            const updatedDoc: Document = { ...editingDocument, ...docData };
            await updateDocument(updatedDoc); // Llama a la función de actualización del hook
            setOpenEditDialog(false); // Cierra el diálogo de edición
            setEditingDocument(null); // Limpia el documento en edición
        }
    };

    /**
     * Cierra el diálogo de edición y limpia el estado relacionado.
     */
    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditingDocument(null);
    };

    /**
     * Cierra el diálogo de visualización y limpia el estado relacionado.
     */
    const handleCloseViewDialog = () => {
        setOpenViewDialog(false);
        setViewingDocument(null);
    };

    const handleAddDocumentSubmit = async (docData: Omit<Document, 'id' | 'status'>) => {
        try {
            await addDocument(docData);
            setModalState({
                open: true,
                resultado: 'exito',
                mensaje: 'Documento guardado exitosamente.',
            });
        } catch (error) {
            console.error('Error al guardar el documento:', error);
            setModalState({
                open: true,
                resultado: 'error',
                mensaje: 'Error al guardar el documento. Por favor, intente de nuevo.',
            });
        }
    };

    const handleCloseModal = () => {
        setModalState(prev => ({ ...prev, open: false }));
    };

    return (
        // Container: Limita el ancho del contenido principal de la página.
        // maxWidth="lg": Establece un ancho máximo grande.
        // sx={{ py: 4 }}: Añade padding vertical de 4 unidades.
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                SPA de Gestión de Documentos
            </Typography>

            {/* Grid container: Organiza el formulario y la lista en un diseño de cuadrícula.
                spacing={4}: Añade espacio entre los elementos de la cuadrícula. */}
            <Grid container spacing={4}>
                {/* Grid item para el formulario de subida de documentos.
                    xs={12}: Ocupa 12 de 12 columnas (ancho completo) en pantallas extra pequeñas.
                    sm={6}: Ocupa 6 de 12 columnas (la mitad del ancho) en pantallas pequeñas y superiores.
                    Esto hace que el diseño sea responsivo. */}
                <Grid item xs={12} sm={6}>
                    <Box component="div">
                        <Typography variant="h5" gutterBottom>
                            Subir Nuevo Documento
                        </Typography>
                        {/* DocumentForm: Componente para el formulario de subida de documentos.
                            onSubmit: Se vincula a la función handleAddDocumentSubmit.
                            documentTypes: Pasa la lista de tipos de documento para el selector. */}
                        <DocumentForm onSubmit={handleAddDocumentSubmit} documentTypes={documentTypes} />
                    </Box>
                </Grid>

                {/* Grid item para la lista de documentos.
                    También es responsivo con xs={12} y sm={6}. */}
                <Grid item xs={12} sm={6}>
                    <Box component="div">
                        {/* DocumentList: Componente para mostrar la lista de documentos.
                            documents: Pasa la lista de documentos obtenida del hook.
                            documentTypes: Pasa los tipos de documento para mostrar sus nombres.
                            onEdit, onView, onDelete, onDownload, onReactivate: Pasan las funciones de manejo
                            de acciones a la lista para que los botones de cada fila puedan invocarlas. */}
                        <DocumentList
                            documents={documents}
                            documentTypes={documentTypes}
                            onEdit={handleEdit}
                            onView={handleView}
                            onDelete={handleDelete}
                            onDownload={handleDownload}
                            onReactivate={handleReactivate}
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* Dialog: Diálogo modal para editar un documento.
                open={openEditDialog}: Controla si el diálogo está abierto.
                onClose={handleCloseEditDialog}: Función para cerrar el diálogo.
                fullWidth maxWidth="sm": El diálogo ocupa todo el ancho disponible hasta un tamaño 'sm'. */}
            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
                <DialogTitle>Editar Documento</DialogTitle>
                <DialogContent>
                    {/* Renderiza DocumentForm solo si hay un documento en edición.
                        initialData: Pasa el documento a editar para precargar el formulario. */}
                    {editingDocument && (
                        <DocumentForm
                            onSubmit={handleUpdateSubmit}
                            documentTypes={documentTypes}
                            initialData={editingDocument}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Cancelar</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog: Diálogo modal para ver los detalles y el contenido de un documento. */}
            <Dialog open={openViewDialog} onClose={handleCloseViewDialog} fullWidth maxWidth="sm">
                <DialogTitle>Ver Documento: {viewingDocument?.name}</DialogTitle>
                <DialogContent>
                    {viewingDocument && (
                        <Box>
                            {/* Muestra los metadatos del documento */}
                            <Typography variant="subtitle1"><strong>Nombre:</strong> {viewingDocument.name}</Typography>
                            <Typography variant="subtitle1"><strong>Tipo:</strong> {documentTypes.find(dt => dt.id === viewingDocument.documentTypeId)?.name || 'Desconocido'}</Typography>
                            <Typography variant="subtitle1"><strong>Fecha de Creación:</strong> {new Date(viewingDocument.creationDate).toLocaleDateString()}</Typography>
                            <Typography variant="subtitle1"><strong>Descripción:</strong> {viewingDocument.description}</Typography>
                            <Typography variant="subtitle1"><strong>Estado:</strong> {viewingDocument.status}</Typography>

                            {/* Sección para mostrar el contenido del archivo (imagen o PDF) */}
                            <Box sx={{ mt: 2 }}>
                                {/* Si es una imagen, la muestra directamente */}
                                {viewingDocument.fileType.startsWith('image/') && (
                                    <img
                                        src={viewingDocument.fileContent}
                                        alt={viewingDocument.fileName}
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                )}
                                {/* Si es un PDF, lo muestra en un iframe */}
                                {viewingDocument.fileType === 'application/pdf' && (
                                    <iframe
                                        src={viewingDocument.fileContent}
                                        width="100%"
                                        height="500px"
                                        style={{ border: 'none' }}
                                    />
                                )}
                                {/* Para otros tipos de archivo, ofrece un enlace de descarga */}
                                {!viewingDocument.fileType.startsWith('image/') &&
                                    viewingDocument.fileType !== 'application/pdf' && (
                                        <Typography>
                                            Tipo de archivo no directamente visible.{' '}
                                            <a href={viewingDocument.fileContent} download={viewingDocument.fileName}>
                                                Descargar Archivo
                                            </a>
                                        </Typography>
                                    )}
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseViewDialog}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal de Mensaje */}
            <ModalMensaje
                open={modalState.open}
                onClose={handleCloseModal}
                resultado={modalState.resultado}
                mensajeModal={modalState.mensaje}
            />
        </Container>
    );
}
