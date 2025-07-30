import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridActionsCellItem,
  GridRowParams,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import type { Document } from '../../../../domain/models/Document';
import type { DocumentType } from '../../../../domain/models/DocumentType';

/**
 * @interface DocumentDataGridModalProps
 * @description Define las propiedades que el componente DocumentDataGridModal acepta.
 * @property {boolean} open - Controla si el modal está abierto o cerrado.
 * @property {() => void} onClose - Función de callback para cerrar el modal.
 * @property {Document[]} documents - Array de objetos Document a mostrar en la tabla.
 * @property {DocumentType[]} documentTypes - Array de objetos DocumentType para mapear IDs a nombres de tipo.
 * @property {(document: Document) => void} onEdit - Función de callback para manejar la edición de un documento.
 * @property {(document: Document) => void} onView - Función de callback para manejar la visualización de un documento.
 * @property {(id: string) => void} onDelete - Función de callback para manejar la eliminación (lógica) de un documento.
 * @property {(document: Document) => void} onDownload - Función de callback para manejar la descarga de un documento.
 * @property {(id: string) => void} onReactivate - Función de callback para manejar la reactivación de un documento eliminado.
 */
interface DocumentDataGridModalProps {
  open: boolean;
  onClose: () => void;
  documents: Document[];
  documentTypes: DocumentType[];
  onEdit: (document: Document) => void;
  onView: (document: Document) => void;
  onDelete: (id: string) => void;
  onDownload: (document: Document) => void;
  onReactivate: (id: string) => void;
}

/**
 * @function DocumentDataGridModal
 * @description Componente modal que muestra una tabla de documentos con funcionalidades de visualización, edición, eliminación, descarga y reactivación.
 * Utiliza Material-UI para la interfaz de usuario y DataGrid para la tabla interactiva.
 * @param {DocumentDataGridModalProps} props - Las propiedades para el componente.
 * @returns {JSX.Element} El componente modal de la tabla de documentos.
 */
export function DocumentDataGridModal({
  open,
  onClose,
  documents,
  documentTypes,
  onEdit,
  onView,
  onDelete,
  onDownload,
  onReactivate,
}: DocumentDataGridModalProps) {
  // Hook de Material-UI para acceder al tema actual.
  const theme = useTheme();
  // Hook para detectar si la pantalla es de tamaño móvil (menor o igual a 'sm' breakpoint).
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * @function getDocumentTypeName
   * @description Función auxiliar para obtener el nombre del tipo de documento a partir de su ID.
   * @param {string} documentTypeId - El ID del tipo de documento.
   * @returns {string} El nombre del tipo de documento o 'Tipo Desconocido' si no se encuentra.
   */
  const getDocumentTypeName = (documentTypeId: string) => {
    const type = documentTypes.find((dt) => dt.id === documentTypeId);
    return type ? type.name : 'Tipo Desconocido';
  };

  /**
   * @constant columns
   * @description Definición de las columnas para el DataGrid.
   * Se utiliza `useMemo` para memorizar la definición de las columnas y evitar recálculos innecesarios
   * en cada renderizado, mejorando el rendimiento.
   */
  const columns: GridColDef[] = useMemo(() => {
    // Columnas base que se aplican tanto a la vista de escritorio como a la móvil (antes de filtrar).
    const baseColumns: GridColDef[] = [
      { field: 'name', headerName: 'Nombre', flex: 1, minWidth: 150 },
      {
        field: 'documentTypeId',
        headerName: 'Tipo',
        flex: 1,
        minWidth: 120,
        // `valueGetter` se usa para mostrar el nombre del tipo de documento en lugar de su ID.
        valueGetter: (params: any) => getDocumentTypeName(params.value as string),
      },
      {
        field: 'creationDate',
        headerName: 'Fecha de Creación',
        flex: 1,
        minWidth: 150,
        // `valueFormatter` formatea la fecha para una visualización legible.
        valueFormatter: (params: any) => new Date(params.value as string).toLocaleDateString(),
      },
      { field: 'status', headerName: 'Estado', flex: 0.5, minWidth: 100 },
      {
        field: 'actions',
        headerName: 'Acciones',
        type: 'actions', // Indica que esta columna contendrá acciones.
        width: 200,
        // `getActions` define las acciones disponibles para cada fila (documento).
        getActions: (params: GridRowParams) => {
          const document = params.row as Document; // Obtiene el objeto documento de la fila actual.
          const actions = [
            <GridActionsCellItem
              icon={<VisibilityIcon />}
              label="Ver"
              onClick={() => onView(document)}
              showInMenu // Muestra la acción en un menú desplegable si hay muchas acciones.
            />,
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Editar"
              onClick={() => onEdit(document)}
              disabled={document.status === 'deleted'} // Deshabilita si el documento está eliminado.
              showInMenu
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Eliminar"
              onClick={() => onDelete(document.id as string)}
              disabled={document.status === 'deleted'} // Deshabilita si el documento está eliminado.
              showInMenu
            />,
            <GridActionsCellItem
              icon={<DownloadIcon />}
              label="Descargar"
              onClick={() => onDownload(document)}
              showInMenu
            />,
          ];

          // Si el documento está eliminado, añade la acción de "Reactivar".
          if (document.status === 'deleted') {
            actions.push(
              <GridActionsCellItem
                icon={<RestoreFromTrashIcon />}
                label="Reactivar"
                onClick={() => onReactivate(document.id as string)}
                showInMenu
              />
            );
          }
          return actions;
        },
      },
    ];

    // Lógica para adaptar las columnas a dispositivos móviles.
    if (isMobile) {
      // Para móvil, solo se muestran las columnas 'name', 'documentTypeId' y 'actions'.
      return baseColumns.filter((col) =>
        ['name', 'documentTypeId', 'actions'].includes(col.field)
      );
    }
    return baseColumns;
  }, [isMobile, documentTypes, onEdit, onView, onDelete, onDownload, onReactivate]); // Dependencias de useMemo.

  return (
    /**
     * Componente Dialog de Material-UI.
     * `open`: Controla la visibilidad del modal.
     * `onClose`: Función para cerrar el modal.
     * `fullWidth` y `maxWidth`: Ajustan el ancho del modal.
     */
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* Título del modal */}
      <DialogTitle>Lista de Documentos</DialogTitle>
      {/* Contenido principal del modal */}
      <DialogContent>
        {/* Contenedor para el DataGrid con altura y ancho definidos */}
        <Box sx={{ height: 400, width: '100%' }}>
          {/*
           * Componente DataGrid de Material-UI X.
           * `rows`: Los datos a mostrar en la tabla.
           * `columns`: La definición de las columnas.
           * `getRowId`: Función para obtener un ID único para cada fila.
           * `initialState`: Configuración inicial de la paginación.
           * `pageSizeOptions`: Opciones de tamaño de página para la paginación.
           * `disableRowSelectionOnClick`: Evita la selección de fila al hacer clic.
           * `slots`: Permite inyectar componentes personalizados, como la barra de herramientas.
           * `filterMode="client"`: Asegura que el filtrado se realice en el lado del cliente.
           * `slotProps`: Propiedades pasadas a los slots, aquí para configurar el QuickFilter de la barra de herramientas.
           */}
          <DataGrid
            rows={documents}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            filterMode="client" // Asegura el filtrado del lado del cliente
            slotProps={{
              toolbar: {
                showQuickFilter: true, // Muestra el campo de búsqueda rápida
                quickFilterProps: { debounceMs: 500 }, // Retraso para el filtro rápido
              },
            }}
          />
        </Box>
      </DialogContent>
      {/* Acciones del modal (botones en la parte inferior) */}
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
