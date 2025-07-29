import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './infrastructure/ui/App'; // Importa el componente principal de la aplicación
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'; // Importa componentes y funciones de Material-UI

// Define un tema personalizado para Material-UI.
// Esto permite centralizar la configuración de estilos como colores, tipografía, etc.
const theme = createTheme({
    palette: {
        primary: {
            main: '#ffeb3b', // Define el color primario de la aplicación (amarillo)
        },
    },
});

// Punto de entrada principal de la aplicación React.
// Renderiza el componente 'App' dentro del elemento HTML con el ID 'root'.
ReactDOM.createRoot(document.getElementById('root')!).render(
    // React.StrictMode es una herramienta para destacar problemas potenciales en una aplicación.
    // Activa comprobaciones y advertencias adicionales durante el desarrollo.
    <React.StrictMode>
        {/* ThemeProvider: Proporciona el tema personalizado de Material-UI a todos los componentes hijos.
            Esto asegura que todos los componentes de Material-UI utilicen los estilos definidos en 'theme'. */}
        <ThemeProvider theme={theme}>
            {/* CssBaseline: Un componente de Material-UI que aplica una base de estilos CSS consistente
                en todos los navegadores. Ayuda a eliminar inconsistencias de estilo predeterminadas. */}
            <CssBaseline />
            {/* App: El componente principal de la aplicación que contiene la estructura, el enrutamiento y las páginas. */}
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
