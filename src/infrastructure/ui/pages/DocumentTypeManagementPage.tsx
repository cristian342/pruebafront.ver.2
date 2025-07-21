import React from 'react';
import { Typography, Container } from '@mui/material';

/**
 * Página de gestión de tipos de documento.
 * Aquí se mostrará la lógica para listar, crear, editar y eliminar tipos de documento.
 */
export function DocumentTypeManagementPage() {
    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                Gestión de Tipos de Documento
            </Typography>
            <Typography variant="body1">
                Contenido de la página de gestión de tipos de documento.
            </Typography>
        </Container>
    );
}
