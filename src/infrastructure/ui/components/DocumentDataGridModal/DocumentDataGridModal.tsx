import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, useMediaQuery, useTheme, } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import type { Document } from '../../../../domain/models/Document';
import type { DocumentType } from '../../../../domain/models/DocumentType';

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

export function DocumentDataGridModal({ open, onClose, documents, documentTypes, onEdit, onView, onDelete, onDownload, onReactivate, }: DocumentDataGridModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getDocumentTypeName = (documentTypeId: string) => {
    const type = documentTypes.find(dt => dt.id === documentTypeId);
    return type ? type.name : 'Tipo Desconocido';
  };

  const columns: GridColDef[] = useMemo(() => {
    const baseColumns: GridColDef[] = [
      { field: 'name', headerName: 'Nombre', flex: 1, minWidth: 150 },
      {
        field: 'documentTypeId',
        headerName: 'Tipo',
        flex: 1,
        minWidth: 120,
        valueGetter: (params: any) => getDocumentTypeName(params.value as string),
      },
      {
        field: 'creationDate',
        headerName: 'Fecha de Creación',
        flex: 1,
        minWidth: 150,
        valueFormatter: (params: any) => new Date(params.value as string).toLocaleDateString(),
      },
      { field: 'status', headerName: 'Estado', flex: 0.5, minWidth: 100 },
      {
        field: 'actions',
        headerName: 'Acciones',
        type: 'actions',
        width: 200,
        getActions: (params: GridRowParams) => {
          const document = params.row as Document;
          const actions = [
            <GridActionsCellItem
              icon={<VisibilityIcon />}
              label="Ver"
              onClick={() => onView(document)}
              showInMenu
            />,
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Editar"
              onClick={() => onEdit(document)}
              disabled={document.status === 'deleted'}
              showInMenu
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Eliminar"
              onClick={() => onDelete(document.id as string)}
              disabled={document.status === 'deleted'}
              showInMenu
            />,
            <GridActionsCellItem
              icon={<DownloadIcon />}
              label="Descargar"
              onClick={() => onDownload(document)}
              showInMenu
            />,
          ];

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

    if (isMobile) {
      // For mobile, show only Name, Type, and Actions
      return baseColumns.filter(col => ['name', 'documentTypeId', 'actions'].includes(col.field));
    }
    return baseColumns;
  }, [isMobile, documentTypes, onEdit, onView, onDelete, onDownload, onReactivate]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Lista de Documentos</DialogTitle>
      <DialogContent>
        <Box sx={{ height: 400, width: '100%' }}>
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
            filterMode="client" // Ensure client-side filtering
            // Enable column visibility management
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
