import React from 'react';
// Importa componentes de React Router DOM para manejar la navegación en la aplicación.
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// Importa componentes de Material-UI para construir la interfaz de usuario.
import {
    AppBar, // Barra de aplicación superior
    Toolbar, // Contenedor para elementos dentro de la AppBar
    Typography, // Componente para mostrar texto con estilos de Material-UI
    Button, // Botón interactivo
    Box, // Componente utilitario para envolver elementos y aplicar estilos
    Container, // Limita el ancho del contenido para una mejor legibilidad
} from '@mui/material';
import { HomePage } from './pages/Homepage'; // Importa la página principal de gestión de documentos
import { DocumentTypeManagementPage } from './pages/DocumentTypeManagementPage'; // Importa la página de gestión de tipos de documento

/**
 * Componente principal de la aplicación.
 * Configura el enrutamiento (navegación) y la barra de navegación global.
 */
function App() {
    return (
        // Router: Envuelve toda la aplicación para habilitar el enrutamiento basado en el historial del navegador.
        <Router>
            {/* AppBar: La barra de aplicación superior que contiene el título y los enlaces de navegación. */}
            <AppBar position="static">
                {/* Toolbar: Contenedor flexible dentro de la AppBar.
                    sx={{ flexWrap: 'wrap' }}: Permite que los elementos dentro de la barra se envuelvan a la siguiente línea
                    en pantallas pequeñas, mejorando la responsividad. */}
                <Toolbar sx={{ flexWrap: 'wrap' }}>
                    {/* Typography: Título de la aplicación.
                        variant="h6": Aplica estilos de encabezado h6.
                        component="div": Renderiza como un div HTML.
                        sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.2rem' } }}:
                            flexGrow: 1: Permite que el título ocupe el espacio disponible.
                            fontSize: { xs: '1rem', sm: '1.2rem' }: Ajusta el tamaño de la fuente
                            (1rem en pantallas extra pequeñas, 1.2rem en pantallas pequeñas y superiores) para responsividad. */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.2rem' } }}
                    >
                        SPA de Gestión de Documentos
                    </Typography>
                    {/* Box: Contenedor para los botones de navegación.
                        sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}:
                            display: 'flex': Usa flexbox para organizar los botones.
                            flexDirection: { xs: 'column', sm: 'row' }: Los botones se apilan verticalmente
                            en pantallas extra pequeñas ('column') y se muestran horizontalmente en pantallas
                            pequeñas y superiores ('row') para responsividad.
                            gap: 1: Añade espacio entre los botones. */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                        {/* Button: Botón de navegación a la página de Documentos.
                            component={Link} to="/": Hace que el botón actúe como un enlace de React Router DOM. */}
                        <Button color="inherit" component={Link} to="/">
                            Documentos
                        </Button>
                        {/* Button: Botón de navegación a la página de Tipos de Documento. */}
                        <Button color="inherit" component={Link} to="/document-types">
                            Tipos de Documento
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Container: Limita el ancho del contenido principal de la aplicación.
                maxWidth="lg": Establece un ancho máximo grande.
                sx={{ mt: 4 }}: Añade un margen superior de 4 unidades. */}
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                {/* Routes: Contenedor para las definiciones de rutas. Renderiza la primera Route que coincide. */}
                <Routes>
                    {/* Route: Define una ruta específica.
                        path="/": La ruta raíz.
                        element={<HomePage />}: El componente a renderizar cuando la URL coincide con la ruta. */}
                    <Route path="/" element={<HomePage />} />
                    {/* Route: Define la ruta para la página de gestión de tipos de documento. */}
                    <Route path="/document-types" element={<DocumentTypeManagementPage />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App; // Exporta el componente App para que pueda ser utilizado en main.tsx
