import React, { useState, useMemo, useCallback } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme, TextField, } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridValueGetter, } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import dayjs, { Dayjs } from 'dayjs'; // Import dayjs and Dayjs
import type { Document } from '../../../../domain/models/Document';
import type { DocumentType } from '../../../../domain/models/DocumentType';
import { ResponsiveDateTimePicker } from '../datepicker/DatePicker'; // Import the DatePicker component

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

export function DocumentDataGridModal({
  open, onClose, documents, documentTypes, onEdit, onView, onDelete, onDownload, onReactivate,
}: DocumentDataGridModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDate, setFilterDate] = useState<Dayjs | null>(null); // State for the date picker
  const [filterStatus, setFilterStatus] = useState('active');

  const getDocumentTypeName = useCallback((id: string | null | undefined) => {
    if (!id) return 'Tipo Desconocido';
    const type = documentTypes.find(dt => String(dt.id) === String(id));
    return type ? type.name : 'Tipo Desconocido';
  }, [documentTypes]); // Dependency: documentTypes

  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }, []); // No dependencies needed for this pure function

  const filteredDocuments = useMemo(() => {
    return documents.filter(document => {
      const nameMatch = filterName ? document.name.toLowerCase().includes(filterName.toLowerCase()) : true;
      const typeMatch = filterType
        ? getDocumentTypeName(document.documentTypeId).toLowerCase().includes(filterType.toLowerCase())
        : true;
      // Modified date filtering to use Dayjs object and compare dates
      const dateMatch = filterDate
        ? dayjs(document.creationDate).format('DD/MM/YYYY') === filterDate.format('DD/MM/YYYY')
        : true;
      const statusMatch = filterStatus
        ? document.status?.toLowerCase().includes(filterStatus.toLowerCase())
        : true;

      return nameMatch && typeMatch && dateMatch && statusMatch;
    });
  }, [documents, filterName, filterType, filterDate, filterStatus, getDocumentTypeName]); // Added getDocumentTypeName as dependency

const columns: GridColDef[] = useMemo(() => {
  const baseColumns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre', flex: 1, minWidth: 150 },
    {
      field: 'documentTypeId',
      headerName: 'Tipo',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => getDocumentTypeName(params.row.documentTypeId),
    },
    {
      field: 'creationDate',
      headerName: 'Fecha de Creación',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => formatDate(params.row.creationDate),
    },
    { field: 'status', headerName: 'Estado', flex: 0.5, minWidth: 100 },
    {
      field: 'actions',
      headerName: 'Acciones',
      type: 'actions',
      width: 200,
      getActions: (params: GridRowParams) => {
        const doc = params.row as Document;
        const actions = [
          <GridActionsCellItem icon={<VisibilityIcon />} label="Ver" onClick={() => onView(doc)} showInMenu />,
          <GridActionsCellItem icon={<EditIcon />} label="Editar" onClick={() => onEdit(doc)} disabled={doc.status === 'deleted'} showInMenu />,
          <GridActionsCellItem icon={<DeleteIcon />} label="Eliminar" onClick={() => onDelete(doc.id as string)} disabled={doc.status === 'deleted'} showInMenu />,
          <GridActionsCellItem icon={<DownloadIcon />} label="Descargar" onClick={() => onDownload(doc)} showInMenu />,
        ];

        if (doc.status === 'deleted') {
          actions.push(
            <GridActionsCellItem icon={<RestoreFromTrashIcon />} label="Reactivar" onClick={() => onReactivate(doc.id as string)} showInMenu />
          );
        }

        return actions;
      },
    },
  ];

  return isMobile
    ? baseColumns.filter(col => ['name', 'status', 'actions'].includes(col.field as string))
    : baseColumns;
}, [documentTypes, onEdit, onView, onDelete, onDownload, onReactivate, isMobile, getDocumentTypeName, formatDate]); // Added getDocumentTypeName and formatDate as dependencies

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Lista de Documentos</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            label="Filtrar por Nombre"
            aria-label="Filtro por nombre"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            sx={{ flex: '1 1 200px' }}
          />
          <TextField
            label="Filtrar por Tipo"
            aria-label="Filtro por tipo"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            sx={{ flex: '1 1 200px' }}
          />
          {/* Replaced TextField with ResponsiveDateTimePicker */}
          <ResponsiveDateTimePicker
            label="Filtrar por Fecha"
            value={filterDate}
            onChange={setFilterDate}
            format="DD/MM/YYYY" // Set the desired format
            slotProps={{
              textField: {
                variant: 'outlined',
                fullWidth: false,
                sx: { flex: '1 1 200px' },
              },
            }}
          />
          <TextField
            label="Filtrar por Estado"
            aria-label="Filtro por estado"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ flex: '1 1 200px' }}
          />
        </Box>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredDocuments}
            columns={columns}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
