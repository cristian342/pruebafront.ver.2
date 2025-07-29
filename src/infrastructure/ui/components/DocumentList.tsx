import React, { useState } from 'react'; // Importa React y el hook useState
// Importa componentes de Material-UI para construir la tabla y los controles de filtrado.
import {
    Box, // Componente utilitario para envolver elementos
    Typography, // Componente para mostrar texto
    Table, // Contenedor para la tabla
    TableBody, // Cuerpo de la tabla
    TableCell, // Celda de la tabla
    TableContainer, // Contenedor para la tabla (permite scroll horizontal)
    TableHead, // Encabezado de la tabla
    TableRow, // Fila de la tabla
    Paper, // Contenedor con elevación (sombra)
    TextField, // Campo de entrada de texto
    Button, // Botón interactivo
    MenuItem, // Opción dentro de un Select
    Select, // Componente de selección (dropdown)
    InputLabel, // Etiqueta para campos de formulario
    FormControl, // Contenedor para agrupar elementos de formulario
    IconButton, // Botón con un icono
} from '@mui/material';
// Importa iconos de Material-UI para las acciones de la tabla.
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import RestartAltIcon from '@mui/icons-material/RestartAlt'; // Icono para limpiar filtros
import type { Document } from '../../../domain/models/Document'; // Importa la interfaz de tipo Documento
import type { DocumentType } from '../../../domain/models/DocumentType'; // Importa la interfaz de tipo DocumentType

// Define las propiedades (props) que este componente espera recibir.
interface DocumentListProps {
    documents: Document[]; // Array de documentos a mostrar
    documentTypes: DocumentType[]; // Array de tipos de documento para mostrar sus nombres y filtrar
    onEdit: (document: Document) => void; // Función para manejar la edición de un documento
    onView: (document: Document) => void; // Función para manejar la visualización de un documento
    onDelete: (id: string) => void; // Función para manejar la eliminación de un documento
    onDownload: (document: Document) => void; // Función para manejar la descarga de un documento
    onReactivate: (id: string) => void; // Función para manejar la reactivación de un documento
}

/**
 * Componente que muestra una lista de documentos con opciones de filtrado y acciones.
 * Permite a los usuarios buscar, filtrar y realizar operaciones CRUD en los documentos.
 */
export function DocumentList({ documents, documentTypes, onEdit, onView, onDelete, onDownload, onReactivate }: DocumentListProps) {
    // Estados locales para los valores de los filtros.
    const [filterName, setFilterName] = useState(''); // Filtro por nombre de documento
    const [filterType, setFilterType] = useState(''); // Filtro por tipo de documento
    const [filterStartDate, setFilterStartDate] = useState(''); // Filtro por fecha de creación (inicio)
    const [filterEndDate, setFilterEndDate] = useState(''); // Filtro por fecha de creación (fin)

    // Lógica de filtrado: Se recalcula cada vez que los documentos o los filtros cambian.
    const filteredDocuments = documents.filter((doc) => {
        // Comprueba si el nombre del documento incluye el texto del filtro (sin distinción de mayúsculas/minúsculas).
        const matchesName = doc.name.toLowerCase().includes(filterName.toLowerCase());
        // Comprueba si el tipo de documento coincide con el filtro, o si el filtro de tipo está vacío (mostrar todos).
        const matchesType = filterType === '' || doc.documentTypeId === filterType;

        // Convierte las fechas de creación y de filtro a objetos Date para comparaciones.
        const docDate = new Date(doc.creationDate);
        const startDate = filterStartDate ? new Date(filterStartDate) : null;
        const endDate = filterEndDate ? new Date(filterEndDate) : null;

        // Comprueba si la fecha del documento es posterior o igual a la fecha de inicio del filtro.
        const matchesStartDate = !startDate || docDate >= startDate;
        // Comprueba si la fecha del documento es anterior o igual a la fecha de fin del filtro.
        const matchesEndDate = !endDate || docDate <= endDate;

        // Un documento coincide si cumple con todos los criterios de filtro.
        return matchesName && matchesType && matchesStartDate && matchesEndDate;
    });

    /**
     * Obtiene el nombre de un tipo de documento dado su ID.
     * @param documentTypeId El ID del tipo de documento.
     * @returns El nombre del tipo de documento o 'Tipo Desconocido' si no se encuentra.
     */
    const getDocumentTypeName = (documentTypeId: string) => {
        const type = documentTypes.find(dt => dt.id === documentTypeId);
        return type ? type.name : 'Tipo Desconocido';
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Lista de Documentos</Typography>

            {/* Contenedor para los campos de filtrado y el botón de limpiar filtros.
                display: 'flex', gap: 2, flexWrap: 'wrap': Usa flexbox para organizar los filtros,
                con espacio entre ellos y permitiendo que se envuelvan en pantallas pequeñas. */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                {/* Campo de texto para filtrar por nombre.
                    sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 200 } }}:
                    Permite que el campo crezca y ocupe todo el ancho en pantallas pequeñas,
                    y un mínimo de 200px en pantallas más grandes. */}
                <TextField
                    label="Filtrar por Nombre"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 200 } }}
                />
                {/* Selector para filtrar por tipo de documento. */}
                <FormControl sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 200 } }}>
                    <InputLabel id="filter-type-label">Filtrar por Tipo</InputLabel>
                    <Select
                        labelId="filter-type-label"
                        value={filterType}
                        label="Filtrar por Tipo"
                        onChange={(e) => setFilterType(e.target.value as string)}
                    >
                        <MenuItem value=""><em>Todos los Tipos</em></MenuItem>
                        {documentTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* Campo de fecha para filtrar por fecha de inicio. */}
                <TextField
                    label="Fecha de Inicio"
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 180 } }}
                />
                {/* Campo de fecha para filtrar por fecha de fin. */}
                <TextField
                    label="Fecha de Fin"
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 180 } }}
                />
                {/* Botón para limpiar todos los filtros. */}
                <Button
                    variant="contained"
                    startIcon={<RestartAltIcon />}
                    onClick={() => {
                        setFilterName('');
                        setFilterType('');
                        setFilterStartDate('');
                        setFilterEndDate('');
                    }}
                    sx={{ alignSelf: 'center', width: { xs: '100%', sm: 'auto' } }}
                >
                    Limpiar Filtros
                </Button>
            </Box>

            {/* TableContainer: Contenedor para la tabla, permite el scroll horizontal si la tabla es muy ancha. */}
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                {/* Table: La tabla de Material-UI. */}
                <Table aria-label="document table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Fecha de Creación</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Renderizado condicional: Si no hay documentos filtrados, muestra un mensaje. */}
                        {filteredDocuments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No se encontraron documentos.</TableCell>
                            </TableRow>
                        ) : (
                            // Mapea sobre los documentos filtrados para renderizar cada fila de la tabla.
                            filteredDocuments.map((doc) => (
                                <TableRow
                                    key={doc.id} // Clave única para cada fila (importante para React)
                                    sx={{
                                        // Estilos condicionales para documentos eliminados (fondo gris, texto tachado).
                                        ...(doc.status === 'deleted' && {
                                            backgroundColor: '#f0f0f0',
                                            textDecoration: 'line-through',
                                        }),
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {doc.name}
                                    </TableCell>
                                    <TableCell>{getDocumentTypeName(doc.documentTypeId)}</TableCell>
                                    <TableCell>{new Date(doc.creationDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{doc.status}</TableCell>
                                    <TableCell align="right">
                                        {/* Botones de acción para cada documento */}
                                        <IconButton aria-label="ver" onClick={() => onView(doc)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton aria-label="editar" onClick={() => onEdit(doc)} disabled={doc.status === 'deleted'}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton aria-label="eliminar" onClick={() => onDelete(doc.id)} disabled={doc.status === 'deleted'}>
                                            <DeleteIcon />
                                        </IconButton>
                                        {/* Botón de reactivar solo visible si el documento está eliminado */}
                                        {doc.status === 'deleted' && (
                                            <IconButton aria-label="reactivar" onClick={() => onReactivate(doc.id)}>
                                                <RestoreFromTrashIcon />
                                            </IconButton>
                                        )}
                                        <IconButton aria-label="descargar" onClick={() => onDownload(doc)}>
                                            <DownloadIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
