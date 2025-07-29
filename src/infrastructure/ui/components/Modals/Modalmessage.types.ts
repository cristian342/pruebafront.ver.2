// Modalmessage.types.ts
export type ResultadoTipo = 'exito' | 'error' | 'advertencia' | 'info';

export interface ModalMensajeProps {
    open: boolean;
    onClose: () => void;
    resultado: ResultadoTipo;
    mensajeModal: string;
    /**
     * Tiempo en ms para autocierre (por defecto 10s). Si lo pones en 0/null, no se autocierra.
     */
    timer?: number;
}