import React, { useState } from 'react';
import { Typography, Container, Box, TextField, Button, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDocumentTypes } from '../hooks/useDocumentTypes';
import type { DocumentType } from '../../../domain/models/DocumentType';

/**
 * Página de gestión de tipos de documento.
 * Permite listar, crear, editar y eliminar tipos de documento.
 */
export function DocumentTypeManagementPage() {
    const { documentTypes, addDocumentType, updateDocumentType, deleteDocumentType } = useDocumentTypes();
    const [newTypeName, setNewTypeName] = useState('');
    const [editingType, setEditingType] = useState<DocumentType | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    const handleAddType = async () => {
        if (newTypeName.trim()) {
            await addDocumentType(newTypeName.trim());
            setNewTypeName('');
        }
    };

    const handleEditClick = (type: DocumentType) => {
        setEditingType(type);
        setNewTypeName(type.name); // Populate the input with the current name
        setOpenEditDialog(true);
    };

    const handleUpdateType = async () => {
        if (editingType && newTypeName.trim()) {
            await updateDocumentType(editingType.id, newTypeName.trim());
            setOpenEditDialog(false);
            setEditingType(null);
            setNewTypeName('');
        }
    };

    const handleDeleteType = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este tipo de documento?')) {
            await deleteDocumentType(id);
        }
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditingType(null);
        setNewTypeName('');
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Gestión de Tipos de Documento
            </Typography>

            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {editingType ? 'Editar Tipo de Documento' : 'Añadir Nuevo Tipo de Documento'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        label="Nombre del Tipo de Documento"
                        variant="outlined"
                        fullWidth
                        value={newTypeName}
                        onChange={(e) => setNewTypeName(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        onClick={editingType ? handleUpdateType : handleAddType}
                        disabled={!newTypeName.trim()}
                    >
                        {editingType ? 'Actualizar' : 'Añadir'}
                    </Button>
                </Box>
            </Box>

            <Typography variant="h5" gutterBottom>
                Tipos de Documento Existentes
            </Typography>
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                {documentTypes.length === 0 ? (
                    <ListItem>
                        <ListItemText primary="No hay tipos de documento registrados." />
                    </ListItem>
                ) : (
                    documentTypes.map((type) => (
                        <ListItem
                            key={type.id}
                            secondaryAction={
                                <Box>
                                    <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(type)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteType(type.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            }
                        >
                            <ListItemText primary={type.name} />
                        </ListItem>
                    ))
                )}
            </List>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Editar Tipo de Documento</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre del Tipo de Documento"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newTypeName}
                        onChange={(e) => setNewTypeName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog}>Cancelar</Button>
                    <Button onClick={handleUpdateType} disabled={!newTypeName.trim()}>Actualizar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}