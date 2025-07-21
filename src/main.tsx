import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './infrastructure/ui/App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ffeb3b', // amarillo
    },
  },
});

// Punto de entrada principal de la aplicación React.
// Renderiza el componente App dentro del elemento con id 'root' en el HTML.
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);