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

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* Aquí envuelves tu app con ThemeProvider */}
        <ThemeProvider theme={theme}>
            {/* CssBaseline es opcional pero recomendado */}
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
);