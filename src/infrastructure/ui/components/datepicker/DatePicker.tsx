import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { esES } from '@mui/x-date-pickers/locales';
import { TextField, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Configuración de zona horaria
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Bogota');

export interface ResponsiveDateTimePickerProps {
    label?: string;
    value?: Dayjs | null;
    onChange?: (date: Dayjs | null) => void;
    disabled?: boolean;
    format?: string;
    minDate?: Dayjs;
    maxDate?: Dayjs;
    disablePast?: boolean;
    disableFuture?: boolean;
    shouldDisableDate?: (day: Dayjs) => boolean;
    readOnly?: boolean;
    slotProps?: Record<string, any>;
}

export const ResponsiveDateTimePicker = ({
    label = 'Fecha y hora (Bogotá)',
    value,
    onChange,
    disabled = false,
    format,
    minDate,
    maxDate,
    disablePast,
    disableFuture,
    shouldDisableDate,
    readOnly,
    slotProps,
}: ResponsiveDateTimePickerProps) => {
    const [internalValue, setInternalValue] = useState<Dayjs | null>(value ?? dayjs().tz());

    // Sincroniza el valor interno si cambia el prop value
    useEffect(() => {
        setInternalValue(value ?? dayjs().tz());
    }, [value]);

    const handleChange = (newValue: Dayjs | null) => {
        const converted = newValue?.tz('America/Bogota');
        setInternalValue(converted ?? null);
        onChange?.(converted ?? null);
    };

    return (
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="es"
            localeText={esES.components?.MuiLocalizationProvider?.defaultProps?.localeText}
        >
            <Box sx={{ width: '100%', maxWidth: 380, m: 'auto', p: 1 }}>
                <DateTimePicker
                    label={label}
                    value={internalValue}
                    onChange={handleChange}
                    ampm={false}
                    disabled={disabled}
                    readOnly={readOnly}
                    format={format}
                    minDate={minDate}
                    maxDate={maxDate}
                    disablePast={disablePast}
                    disableFuture={disableFuture}
                    shouldDisableDate={shouldDisableDate}
                    views={['year', 'month', 'day', 'hours', 'minutes']}
                    sx={{
                        width: '100%',
                        '& .MuiInputBase-root': {
                            backgroundColor: '#e3f2fd',
                            borderRadius: 2,
                            px: 1,
                        },
                    }}
                    slots={{ textField: TextField }}
                    slotProps={slotProps}
                    enableAccessibleFieldDOMStructure={false}
                />
            </Box>
        </LocalizationProvider>
    );
};
