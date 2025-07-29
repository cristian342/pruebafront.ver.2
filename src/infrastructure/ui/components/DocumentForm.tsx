import React, { useState, useEffect } from 'react'; // Importa React y los hooks useState y useEffect
// Importa componentes de Material-UI para construir el formulario.
import {
    TextField, // Campo de entrada de texto
    Button, // Botón interactivo
    Box, // Componente utilitario para envolver elementos
    MenuItem, // Opción dentro de un Select
    Select, // Componente de selección (dropdown)
    InputLabel, // Etiqueta para campos de formulario
    FormControl, // Contenedor para agrupar elementos de formulario
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select'; // Tipo para eventos de cambio en Select
import type { Document } from '../../../domain/models/Document'; // Importa la interfaz de tipo Documento
import type { DocumentType } from '../../../domain/models/DocumentType'; // Importa la interfaz de tipo DocumentType

// Define las propiedades (props) que este componente espera recibir.
interface Props {
    onSubmit: (doc: Omit<Document, 'id' | 'status'>) => void; // Función que se llama al enviar el formulario
    documentTypes: DocumentType[]; // Lista de tipos de documento disponibles para el selector
    initialData?: Omit<Document, 'id' | 'status'>; // Datos iniciales para el formulario (opcional, para edición)
}

/**
 * Componente de formulario para crear o actualizar documentos.
 * Permite al usuario introducir los metadatos de un documento y adjuntar un archivo.
 */
export function DocumentForm({ onSubmit, documentTypes, initialData }: Props) {
    // Estado local del formulario. Se inicializa con `initialData` si se proporciona (modo edición),
    // o con valores vacíos/predeterminados para un nuevo documento (modo creación).
    const [form, setForm] = useState<Omit<Document, 'id' | 'status'>>(() => initialData || {
        name: '',
        documentTypeId: '',
        creationDate: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
        fileContent: '',
        fileName: '',
        fileType: '',
        description: '',
    });

    // useEffect: Se ejecuta cuando `initialData` cambia.
    // Esto asegura que el formulario se actualice correctamente si se cambia el documento a editar.
    useEffect(() => {
        if (initialData) {
            setForm(initialData); // Actualiza el estado del formulario con los nuevos datos iniciales
        }
    }, [initialData]); // Dependencia: el efecto se re-ejecuta si `initialData` cambia

    /**
     * Maneja los cambios en los campos de texto y selectores del formulario.
     * Actualiza el estado del formulario con el nuevo valor del campo.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target; // Obtiene el nombre del campo y su nuevo valor
        setForm(prevForm => ({ ...prevForm, [name]: value })); // Actualiza el estado del formulario de forma inmutable
    };

    /**
     * Maneja la selección de un archivo por parte del usuario.
     * Lee el archivo como una URL de datos (base64) y actualiza el estado del formulario
     * con el contenido, nombre y tipo del archivo.
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Obtiene el primer archivo seleccionado
        if (file) {
            const reader = new FileReader(); // Crea un nuevo lector de archivos
            reader.onload = (event) => {
                const base64 = event.target?.result as string; // Obtiene el contenido del archivo en base64
                setForm(prevForm => ({
                    ...prevForm,
                    fileContent: base64, // Guarda el contenido base64
                    fileName: file.name, // Guarda el nombre del archivo
                    fileType: file.type, // Guarda el tipo MIME del archivo
                }));
            };
            reader.readAsDataURL(file); // Lee el archivo como una URL de datos (base64)
        }
    };

    /**
     * Maneja el envío del formulario.
     * Realiza validaciones y llama a la función `onSubmit` proporcionada por las props.
     * Si es un nuevo documento, resetea el formulario después del envío.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Previene el comportamiento predeterminado del formulario (recarga de página)

        // Validaciones: Asegura que los campos obligatorios estén llenos.
        // Para nuevos documentos, también se requiere adjuntar un archivo.
        if (!form.name || !form.documentTypeId || !form.creationDate || !form.description || (!initialData && !form.fileContent)) {
            alert('Por favor, complete todos los campos obligatorios y adjunte un archivo para nuevos documentos.');
            return; // Detiene el envío si la validación falla
        }

        onSubmit(form); // Llama a la función onSubmit pasada por las props con los datos del formulario

        // Si no estamos en modo edición (es decir, es un nuevo documento), resetea el formulario.
        if (!initialData) {
            setForm({
                name: '',
                documentTypeId: '',
                creationDate: new Date().toISOString().split('T')[0],
                fileContent: '',
                fileName: '',
                fileType: '',
                description: '',
            });
        }
    };

    return (
        // Box: Contenedor para el formulario.
        // component="form": Renderiza el Box como un elemento <form> HTML.
        // onSubmit={handleSubmit}: Vincula la función de envío del formulario.
        // sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}:
        //   display: 'flex': Usa flexbox para organizar los campos.
        //   flexDirection: 'column': Los campos se apilan verticalmente.
        //   gap: 2: Añade espacio entre los campos.
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* TextField para el nombre del documento */}
            <TextField
                label="Nombre del Documento"
                name="name"
                value={form.name}
                onChange={handleChange}
                required // Marca el campo como obligatorio
            />
            {/* FormControl para el selector de Tipo de Documento */}
            <FormControl fullWidth required>
                <InputLabel id="document-type-label">Tipo de Documento</InputLabel>
                <Select
                    labelId="document-type-label"
                    id="documentTypeId"
                    name="documentTypeId"
                    value={form.documentTypeId}
                    label="Tipo de Documento" // La etiqueta se muestra dentro del Select
                    onChange={handleChange}
                >
                    {/* Mapea sobre la lista de tipos de documento para crear las opciones del selector */}
                    {documentTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                            {type.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {/* TextField para la fecha de creación */}
            <TextField
                label="Fecha de Creación"
                name="creationDate"
                type="date" // Tipo de input HTML para un selector de fecha
                value={form.creationDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }} // Asegura que la etiqueta se "encoge" correctamente
                required
            />
            {/* TextField para adjuntar archivo (solo visible en modo creación, no en edición) */}
            {!initialData && (
                <TextField
                    label="Adjuntar Archivo (PDF, JPG, PNG)"
                    name="file"
                    type="file" // Tipo de input HTML para selección de archivo
                    onChange={handleFileChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ accept: '.pdf,.jpg,.png' }} // Filtra los tipos de archivo permitidos
                    required
                />
            )}
            {/* TextField para la descripción del documento */}
            <TextField
                label="Descripción"
                name="description"
                value={form.description}
                onChange={handleChange}
                multiline // Permite múltiples líneas de texto
                rows={4} // Establece la altura inicial en 4 filas
                required
            />
            {/* Button para enviar el formulario */}
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                {/* El texto del botón cambia según el modo (creación o edición) */}
                {initialData ? 'Actualizar Documento' : 'Subir Documento'}
            </Button>
        </Box>
    );
}
