import { useState } from 'react';
import { DocumentForm } from '../components/DocumentForm';
import { DocumentList } from '../components/DocumentList';
import { useDocuments } from '../hooks/useDocuments';
import { useDocumentTypes } from '../hooks/useDocumentTypes';
import { Grid, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Container} from '@mui/material';
import type { Document } from '../../../domain/models/Document';

export function HomePage() {
    const { documents, addDocument, updateDocument, deleteDocument, reactivateDocument } = useDocuments();
    const { documentTypes } = useDocumentTypes();

    const [editingDocument, setEditingDocument] = useState<Document | null>(null);
    const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openViewDialog, setOpenViewDialog] = useState(false);

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
            await deleteDocument(id);
        }
    };

    const handleReactivate = async (id: string) => {
        await reactivateDocument(id);
    };

    const handleDownload = (doc: Document) => {
        if (doc.fileContent && doc.fileName && doc.fileType) {
            const base64Data = doc.fileContent.split(',')[1];
            const byteCharacters = atob(base64Data);
            const byteArray = new Uint8Array([...byteCharacters].map(c => c.charCodeAt(0)));
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
        if (editingDocument) {
            const updatedDoc: Document = { ...editingDocument, ...docData };
            await updateDocument(updatedDoc);
            setOpenEditDialog(false);
            setEditingDocument(null);
        }
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditingDocument(null);
    };

    const handleCloseViewDialog = () => {
        setOpenViewDialog(false);
        setViewingDocument(null);
    };

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
                        <DocumentForm onSubmit={addDocument} documentTypes={documentTypes} />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Box component="div">
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

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
                <DialogTitle>Editar Documento</DialogTitle>
                <DialogContent>
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

            <Dialog open={openViewDialog} onClose={handleCloseViewDialog} fullWidth maxWidth="sm">
                <DialogTitle>Ver Documento: {viewingDocument?.name}</DialogTitle>
                <DialogContent>
                    {viewingDocument && (
                        <Box>
                            <Typography variant="subtitle1"><strong>Nombre:</strong> {viewingDocument.name}</Typography>
                            <Typography variant="subtitle1"><strong>Tipo:</strong> {documentTypes.find(dt => dt.id === viewingDocument.documentTypeId)?.name || 'Desconocido'}</Typography>
                            <Typography variant="subtitle1"><strong>Fecha de Creación:</strong> {new Date(viewingDocument.creationDate).toLocaleDateString()}</Typography>
                            <Typography variant="subtitle1"><strong>Descripción:</strong> {viewingDocument.description}</Typography>
                            <Typography variant="subtitle1"><strong>Estado:</strong> {viewingDocument.status}</Typography>

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
        </Container>
    );
}
