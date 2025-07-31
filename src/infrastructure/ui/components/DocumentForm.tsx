import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { Document } from '../../../domain/models/Document';
import type { DocumentType } from '../../../domain/models/DocumentType';
import { ResponsiveDateTimePicker } from '../components/datepicker/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { esES } from '@mui/x-date-pickers/locales';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Bogota');

interface Props {
    onSubmit: (doc: Omit<Document, 'id' | 'status'> | Document) => void;
    documentTypes: DocumentType[];
    initialData?: Document;
}

interface DocumentFormState extends Omit<Document, 'id' | 'status' | 'creationDate'> {
    creationDate: Dayjs | null;
}

export function DocumentForm({ onSubmit, documentTypes, initialData }: Props) {
    const [form, setForm] = useState<DocumentFormState>(() => {
        const initialCreationDate = initialData?.creationDate
            ? dayjs(initialData.creationDate).tz()
            : dayjs().tz();

        return {
            name: initialData?.name || '',
            documentTypeId: initialData?.documentTypeId || '',
            creationDate: initialCreationDate,
            fileContent: initialData?.fileContent || '',
            fileName: initialData?.fileName || '',
            fileType: initialData?.fileType || '',
            description: initialData?.description || '',
        };
    });

    useEffect(() => {
        if (initialData) {
            const initialCreationDate = initialData.creationDate
                ? dayjs(initialData.creationDate).tz()
                : dayjs().tz();
            setForm({
                ...initialData,
                creationDate: initialCreationDate,
            });
        }
    }, [initialData]);

    const handleDateChange = (date: Dayjs | null) => {
        setForm(prevForm => ({ ...prevForm, creationDate: date }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                setForm(prevForm => ({
                    ...prevForm,
                    fileContent: base64,
                    fileName: file.name,
                    fileType: file.type,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: String(value), // Ensure documentTypeId is always a string
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.documentTypeId || !form.creationDate || !form.description || (!initialData && !form.fileContent)) {
            alert('Por favor, complete todos los campos obligatorios y adjunte un archivo para nuevos documentos.');
            return;
        }

        const dateString = form.creationDate ? form.creationDate.format('YYYY-MM-DD') : '';

        if (initialData) {
            onSubmit({
                ...initialData,
                ...form,
                creationDate: dateString,
            });
        } else {
            onSubmit({
                ...form,
                creationDate: dateString,
            });
        }

        if (!initialData) {
            setForm({
                name: '',
                documentTypeId: '',
                creationDate: dayjs().tz(),
                fileContent: '',
                fileName: '',
                fileType: '',
                description: '',
            });
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'center', // Centra horizontalmente los elementos del formulario
                    '& .MuiTextField-root, & .MuiFormControl-root': { width: '100%', maxWidth: '400px' }, // Ajusta el ancho de los campos
                }}
            >
                <TextField
                    label="Nombre del Documento"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <FormControl fullWidth required>
                    <InputLabel id="document-type-label">Tipo de Documento</InputLabel>
                    <Select
                        labelId="document-type-label"
                        id="documentTypeId"
                        name="documentTypeId"
                        value={form.documentTypeId}
                        label="Tipo de Documento"
                        onChange={handleSelectChange}
                    >
                        {documentTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                                {type.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <ResponsiveDateTimePicker
                    label="Fecha de Creación"
                    value={form.creationDate}
                    onChange={handleDateChange}
                    disablePast={false}
                    format="YYYY-MM-DD"
                    slotProps={{
                        textField: {
                            required: true,
                            InputLabelProps: { shrink: true },
                        }
                    }}
                />
                {!initialData && (
                    <TextField
                        label="Adjuntar Archivo (PDF, JPG, PNG)"
                        name="file"
                        type="file"
                        onChange={handleFileChange}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ accept: '.pdf,.jpg,.png' }}
                        required
                    />
                )}
                <TextField
                    label="Descripción"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                />
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    {initialData ? 'Actualizar Documento' : 'Subir Documento'}
                </Button>
            </Box>
        </LocalizationProvider>
    );
}
