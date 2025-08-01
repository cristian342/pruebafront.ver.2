import React, { useState, useEffect } from 'react';
import { DocumentForm } from '../components/DocumentForm';
import { DocumentDataGridModal } from '../components/DocumentDataGridModal/DocumentDataGridModal';
import { useDocuments } from '../hooks/useDocuments';
import { useDocumentTypes } from '../hooks/useDocumentTypes';
import type { DocumentType } from '../../../domain/models/DocumentType';
import { Grid, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Container } from '@mui/material';
import type { Document } from '../../../domain/models/Document';
import ModalMensaje from '../components/Modals/Modalmessage';
// No longer need to import ResultadoTipo here as it's handled by useDocuments hook

// Dayjs solo para mostrar la fecha en el modal de "Ver"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es';

dayjs.extend(utc);
dayjs.extend(timezone);
// Trigger re-compilation

export function HomePage() {
  const {
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
    reactivateDocument,
    modalOpen, // Destructure from useDocuments
    modalType, // Destructure from useDocuments
    modalMessage, // Destructure from useDocuments
    closeModal, // Destructure from useDocuments
  } = useDocuments();
  const { documentTypes } = useDocumentTypes();

  useEffect(() => {
    console.log('Documents:', documents);
    console.log('Document Types:', documentTypes);
    // Expose data to window for inspection
    (window as any).documents = documents;
    (window as any).documentTypes = documentTypes;
  }, [documents, documentTypes]);

  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDataGridModal, setOpenDataGridModal] = useState(false);

  const handleOpenDataGridModal = () => setOpenDataGridModal(true);
  const handleCloseDataGridModal = () => setOpenDataGridModal(false);

  const handleEdit = (doc: Document) => {
    setEditingDocument(doc);
    setOpenEditDialog(true);
  };

  const handleView = (doc: Document) => {
    setViewingDocument(doc);
    setOpenViewDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      // Modal logic moved to useDocuments hook
      await deleteDocument(id);
    }
  };

  const handleReactivate = async (id: string) => {
    // Modal logic moved to useDocuments hook
    await reactivateDocument(id);
  };

  const handleDownload = (doc: Document) => {
    if (doc.fileContent && doc.fileName && doc.fileType) {
      const base64Data = doc.fileContent.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteArray = new Uint8Array([...byteCharacters].map((c) => c.charCodeAt(0)));
      const blob = new Blob([byteArray], { type: doc.fileType });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } else {
      alert('No hay archivo adjunto para descargar.');
    }
  };

  const handleUpdateSubmit = async (docData: Document) => {
    if (!editingDocument) return;
    // Modal logic moved to useDocuments hook
    await updateDocument(docData);
    setOpenEditDialog(false);
    setEditingDocument(null);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditingDocument(null);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setViewingDocument(null);
  };

  const handleAddDocumentSubmit = async (docData: Omit<Document, 'id' | 'status'>) => {
    // Modal logic moved to useDocuments hook
    await addDocument(docData);
  };

  // Removed local handleCloseModal as it's now managed by useDocuments hook
  /*
  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, open: false }));
  };
  */

  // Helpers para el diálogo de visualización
  const tipoDeDocumentoNombre = viewingDocument
    ? documentTypes.find((dt) => String(dt.id) === String(viewingDocument.documentTypeId))?.name ?? 'Desconocido'
    : '';

  const fechaCreacionLocal = viewingDocument
    ? dayjs(viewingDocument.creationDate).tz('America/Bogota').format('DD/MM/YYYY')
    : '';

  return (
    <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}> {/* Added textAlign: 'center' */}
      <Typography variant="h4" gutterBottom>
        SPA de Gestión de Documentos
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h5">{documents.length}</Typography>
          <Typography variant="subtitle1">Documentos Totales</Typography>
        </Box>
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h5">{documentTypes.length}</Typography>
          <Typography variant="subtitle1">Tipos de Documento</Typography>
        </Box>
      </Box>

      <Grid container spacing={4} justifyContent="center"> {/* Added justifyContent="center" */}
        <Grid item xs={12}> {/* Changed sm={6} to xs={12} to stack vertically */}
          <Box component="div" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* Added flexbox for centering */}
            <Typography variant="h5" gutterBottom>
              Subir Nuevo Documento
            </Typography>
            <DocumentForm
              onSubmit={(d) => { void handleAddDocumentSubmit(d as Omit<Document, 'id' | 'status'>); }}
            />
          </Box>
        </Grid>
        <Grid item xs={12}> {/* Changed sm={6} to xs={12} to stack vertically */}
          <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}> {/* Adjusted Box for alignment */}
            <Button variant="contained" onClick={handleOpenDataGridModal}>
              Ver Lista de Documentos
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Editar */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Editar Documento</DialogTitle>
        <DialogContent>
          {editingDocument && (
            // Opción B: envolver para devolver void
            <DocumentForm
              onSubmit={(d) => { void handleUpdateSubmit(d as Document); }}
              // Removed documentTypes prop
              initialData={editingDocument}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Ver */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} fullWidth maxWidth="sm">
        <DialogTitle>Ver Documento: {viewingDocument?.name}</DialogTitle>
        <DialogContent>
          {viewingDocument && (
            <Box>
              <Typography variant="subtitle1">
                <strong>Nombre:</strong> {viewingDocument.name}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Tipo:</strong> {tipoDeDocumentoNombre}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Fecha de Creación:</strong> {fechaCreacionLocal}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Descripción:</strong> {viewingDocument.description}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Estado:</strong> {viewingDocument.status}
              </Typography>

              <Box sx={{ mt: 2 }}>
                {viewingDocument.fileType.startsWith('image/') && (
                  <img
                    src={viewingDocument.fileContent}
                    alt={viewingDocument.fileName}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                )}

                {viewingDocument.fileType === 'application/pdf' && (
                  <iframe
                    src={viewingDocument.fileContent}
                    width="100%"
                    height="500px"
                    style={{ border: 'none' }}
                  />
                )}

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
        open={modalOpen}
        onClose={closeModal}
        resultado={modalType}
        mensajeModal={modalMessage}
      />

      {/* Modal de DataGrid */}
      <DocumentDataGridModal
        open={openDataGridModal}
        onClose={handleCloseDataGridModal}
        documents={documents}
        documentTypes={documentTypes}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onDownload={handleDownload}
        onReactivate={handleReactivate}
      />
    </Container>
  );
}
