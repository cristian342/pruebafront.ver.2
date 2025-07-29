// Modalmessage.tsx
import React, { useEffect } from 'react';
import { Modal, Box, Typography, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { ModalMensajeProps, ResultadoTipo } from './Modalmessage.types';

const iconos: Record<ResultadoTipo, React.ReactElement> = {
  exito: <CheckCircleIcon color="success" sx={{ fontSize: { xs: 28, sm: 32 } }} />,
  error: <ErrorIcon color="error" sx={{ fontSize: { xs: 28, sm: 32 } }} />,
  peligro: <WarningIcon color="warning" sx={{ fontSize: { xs: 28, sm: 32 } }} />,
  info: <InfoIcon color="info" sx={{ fontSize: { xs: 28, sm: 32 } }} />,
};

const ModalMensaje: React.FC<ModalMensajeProps> = ({
  open,
  onClose,
  resultado,
  mensajeModal,
  timer = 10000,
}) => {
  // Autocierre opcional
  useEffect(() => {
    if (!open || !timer) return;
    const timeout = setTimeout(() => onClose(), timer);
    return () => clearTimeout(timeout);
  }, [open, timer, onClose]);

  // IDs para accesibilidad
  const titleId = 'modal-mensaje-title';
  const descId = 'modal-mensaje-description';

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={descId}
      // Mejora de accesibilidad/UX en móvil: scroll si el contenido es largo
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

          // Ancho responsivo
          width: { xs: '90%', sm: '80%', md: 480 },
          maxWidth: '95vw',

          // Manejo de alto en móviles y textos largos
          maxHeight: '90vh',
          overflowY: 'auto',

          // Usa el background del tema (claro/oscuro)
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 2,
          boxShadow: '0px 5px 20px rgba(0, 0, 0, 0.2)',
          p: { xs: 2, sm: 3 },
          outline: 0,
        })}
      >
        {/* Encabezado */}
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
          <Typography
            id={titleId}
            variant="h6"
            sx={{
              flexGrow: 1,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              lineHeight: 1.2,
            }}
          >
            {resultado.charAt(0).toUpperCase() + resultado.slice(1)}
          </Typography>

          <IconButton
            aria-label="Cerrar"
            onClick={onClose}
            size="small"
            sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Contenido */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            // Cambio de layout según tamaño: apilado en móvil, en fila en pantallas >= sm
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' },
            wordBreak: 'break-word',
          }}
        >
          {iconos[resultado]}

          <Typography
            id={descId}
            variant="body1"
            sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
          >
            {mensajeModal}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalMensaje;
