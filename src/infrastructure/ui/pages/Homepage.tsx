import React, { useState } from 'react';
import { DocumentForm } from '../components/DocumentForm';
import { DocumentDataGridModal } from '../components/DocumentDataGridModal/DocumentDataGridModal';
import { useDocuments } from '../hooks/useDocuments';
import { useDocumentTypes } from '../hooks/useDocumentTypes';
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

  const handleUpdateSubmit = async (docData: Omit<Document, 'id' | 'status'>) => {
    if (!editingDocument) return;
    const updatedDoc: Document = { ...editingDocument, ...docData };
    // Modal logic moved to useDocuments hook
    await updateDocument(updatedDoc);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        SPA de Gestión de Documentos
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <Box component="div">
            <Typography variant="h5" gutterBottom>
              Subir Nuevo Documento
            </Typography>

            {/* Opción B: envolver para devolver void */}
            <DocumentForm
              onSubmit={(d) => { void handleAddDocumentSubmit(d); }}
              documentTypes={documentTypes}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ mt: 4, mb: 2 }}>
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
              onSubmit={(d) => { void handleUpdateSubmit(d); }}
              documentTypes={documentTypes}
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
