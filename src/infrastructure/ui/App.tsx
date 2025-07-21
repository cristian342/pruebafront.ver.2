import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container,
} from '@mui/material';
import { HomePage } from './pages/Homepage';
import { DocumentTypeManagementPage } from './pages/DocumentTypeManagementPage';

/**
 * Componente principal de la aplicación.
 * Configura el enrutamiento y la barra de navegación para la gestión de documentos.
 */
function App() {
    return (
        <Router>
            <AppBar position="static">
                <Toolbar sx={{ flexWrap: 'wrap' }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.2rem' } }}
                    >
                        SPA de Gestión de Documentos
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                        <Button color="inherit" component={Link} to="/">
                            Documentos
                        </Button>
                        <Button color="inherit" component={Link} to="/document-types">
                            Tipos de Documento
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/document-types" element={<DocumentTypeManagementPage />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
