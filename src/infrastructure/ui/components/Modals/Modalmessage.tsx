// Modalmessage.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Divider, IconButton, LinearProgress, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { ModalMensajeProps, ResultadoTipo } from './Modalmessage.types';

// Componente CircularProgressWithLabel
interface CircularProgressWithLabelProps {
  value: number;
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({ value }) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" value={value} size={60} thickness={5} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

// Objeto que mapea los tipos de resultado a sus respectivos iconos de Material-UI
const iconos: Record<ResultadoTipo, React.ReactElement> = {
  exito: <CheckCircleIcon color="success" sx={{ fontSize: { xs: 28, sm: 32 } }} />,
  error: <ErrorIcon color="error" sx={{ fontSize: { xs: 28, sm: 32 } }} />,
  peligro: <WarningIcon color="warning" sx={{ fontSize: { xs: 28, sm: 32 } }} />,
  info: <InfoIcon color="info" sx={{ fontSize: { xs: 28, sm: 32 } }} />,
};

// Componente funcional ModalMensaje
const ModalMensaje: React.FC<ModalMensajeProps> = ({
  open, // Propiedad para controlar si el modal está abierto o cerrado
  onClose, // Función para cerrar el modal
  resultado, // Tipo de resultado (exito, error, peligro, info) para determinar el icono
  mensajeModal, // Mensaje a mostrar dentro del modal
  timer = 10000, // Duración del temporizador de autocierre en milisegundos (por defecto 10 segundos)
}) => {
  // Estado para el tiempo restante del temporizador (en segundos)
  const [remainingTime, setRemainingTime] = useState(timer / 1000);
  // Estado para el progreso de la barra lineal (de 0 a 100)
  const [progress, setProgress] = useState(100);

  // Efecto para manejar el autocierre y el contador de tiempo
  useEffect(() => {
    // Si el modal no está abierto o no hay temporizador, reinicia los estados y sale
    if (!open || !timer) {
      setRemainingTime(timer / 1000); // Reinicia el tiempo restante
      setProgress(100); // Reinicia el progreso
      return;
    }

    // Inicializa el tiempo restante y el progreso cuando el modal se abre
    setRemainingTime(timer / 1000);
    setProgress(100);

    // Intervalo para actualizar el tiempo restante cada segundo
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval); // Detiene el intervalo si el tiempo se agota
          onClose(); // Cierra el modal
          return 0;
        }
        return prevTime - 1; // Decrementa el tiempo
      });
    }, 1000);

    // Intervalo para actualizar el progreso de la barra lineal
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress <= 0) {
          clearInterval(progressInterval); // Detiene el intervalo si el progreso llega a 0
          return 0;
        }
        // Calcula el decremento del progreso basado en la duración total del temporizador
        return prevProgress - (100 / (timer / 1000));
      });
    }, 1000);

    // Temporizador principal para cerrar el modal después de la duración especificada
    const timeout = setTimeout(() => {
      clearInterval(interval); // Limpia el intervalo del contador
      clearInterval(progressInterval); // Limpia el intervalo del progreso
      onClose(); // Cierra el modal
    }, timer);

    // Función de limpieza que se ejecuta cuando el componente se desmonta o las dependencias cambian
    return () => {
      clearTimeout(timeout); // Limpia el temporizador principal
      clearInterval(interval); // Limpia el intervalo del contador
      clearInterval(progressInterval); // Limpia el intervalo del progreso
    };
  }, [open, timer, onClose]); // Dependencias del efecto: open, timer, onClose

  // IDs para accesibilidad (aria-labelledby, aria-describedby)
  const titleId = 'modal-mensaje-title';
  const descId = 'modal-mensaje-description';

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descId}
      // Mejora de accesibilidad/UX en móvil: permite scroll si el contenido es largo
      keepMounted
      disableAutoFocus={false}
    >
      <Box
        role="dialog"
        aria-modal="true"
        sx={(theme) => ({
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',

          // Ancho responsivo del modal
          width: { xs: '90%', sm: '80%', md: 480 },
          maxWidth: '95vw',

          // Manejo de alto en móviles y textos largos, con scroll si es necesario
          maxHeight: '90vh',
          overflowY: 'auto',

          // Usa el background del tema (claro/oscuro) de Material-UI
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 2,
          boxShadow: '0px 5px 20px rgba(0, 0, 0, 0.2)',
          p: { xs: 2, sm: 3 }, // Padding responsivo
          outline: 0,
        })}
      >
        {/* Encabezado del modal */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mb: 1,
          }}
        >
          {/* Título del modal */}
          <Typography
            id={titleId}
            variant="h4" // Se aumentó el tamaño de la fuente para que sea más prominente
            sx={{
              flexGrow: 1,
              textAlign: 'center', // Se centró el título
              fontSize: { xs: '2rem', sm: '2.5rem' }, // Tamaño de fuente responsivo
              lineHeight: 1.2,
              mb: 2, // Margen inferior para separar del contenido
            }}
          >
            {resultado.charAt(0).toUpperCase() + resultado.slice(1)} {/* Capitaliza la primera letra del resultado */}
          </Typography>

          {/* Botón de cerrar movido a la esquina superior derecha para mejor UX en móvil */}
          <IconButton
            aria-label="Cerrar"
            onClick={onClose}
            size="small"
            sx={{
              position: 'absolute', // Posicionamiento absoluto para colocarlo en la esquina
              top: { xs: 8, sm: 16 }, // Posición desde arriba (responsivo)
              right: { xs: 8, sm: 16 }, // Posición desde la derecha (responsivo)
              zIndex: 1, // Asegura que esté por encima de otros elementos
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} /> {/* Divisor visual */}

        {/* Contenido principal del modal (icono y mensaje) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center', // Reverted to center
            gap: 2,
            // Changed layout to always stack vertically
            flexDirection: 'column',
            textAlign: 'center', // Centered text for consistency
            wordBreak: 'break-word', // Permite que las palabras largas se rompan para evitar desbordamiento
          }}
        >
          {iconos[resultado]} {/* Muestra el icono correspondiente al resultado */}

          <Typography
            id={descId}
            variant="body1"
            sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }} // Tamaño de fuente responsivo para el mensaje
          >
            {mensajeModal} {/* Muestra el mensaje del modal */}
          </Typography>
        </Box>

        {/* Sección del temporizador y barra de progreso, solo si hay un temporizador definido */}
        {timer && (
          <Box sx={{ mt: 3, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <CircularProgressWithLabel value={progress} />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ModalMensaje;
