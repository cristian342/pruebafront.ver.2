// Modalmessage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Modal, Box, Typography, Divider, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { ModalMensajeProps, ResultadoTipo } from './Modalmessage.types';

// Componente CircularProgressWithLabel
const CircularProgressWithLabel: React.FC<{ value: number; displayValue: number }> = ({ value, displayValue }) => {
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
          {`${Math.round(displayValue)} seg`}
        </Typography>
      </Box>
    </Box>
  );
};

// Objeto que mapea los tipos de resultado a sus respectivos iconos de Material-UI
const iconos: Record<ResultadoTipo, React.ReactElement> = {
  exito: <CheckCircleIcon color="success" sx={{ fontSize: { xs: 28, sm: 32 } }} />,
  error: <ErrorIcon color="error" sx={{ fontSize: { xs: 28, sm: 32 } }} />,
  advertencia: <WarningIcon color="warning" sx={{ fontSize: { xs: 28, sm: 32 } }} />,
  aviso: <InfoIcon color="info" sx={{ fontSize: { xs: 28, sm: 32 } }} />,
};

// Componente funcional ModalMensaje
const ModalMensaje: React.FC<ModalMensajeProps> = ({
  open,
  onClose,
  resultado,
  mensajeModal,
  timer = 10000,
  actions,
}) => {
  const [remainingTime, setRemainingTime] = useState(timer / 1000);

  useEffect(() => {
    if (open && timer) {
      setRemainingTime(timer / 1000); // Reinicia el tiempo cada vez que se abre

      const intervalId = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalId);
            onClose(); // Cierra el modal cuando el tiempo llega a 0
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => {
        clearInterval(intervalId); // Limpia el intervalo si el componente se desmonta o el modal se cierra
      };
    }
  }, [open, timer, onClose]);

  // Deriva el progreso directamente del tiempo restante para evitar estados redundantes
  const progress = timer > 0 ? (remainingTime * 1000 / timer) * 100 : 0;

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

        {timer && (
          <Box sx={{ mt: 3, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Esta ventana se cerrará en:
            </Typography>
            <CircularProgressWithLabel value={progress} displayValue={remainingTime} />
          </Box>
        )}

        {actions && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {actions}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ModalMensaje;
