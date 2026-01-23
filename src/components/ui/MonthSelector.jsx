import React, { useTransition, useState } from 'react';
import { Box, Typography, IconButton, useTheme, CircularProgress } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

// Utilitário formate fora do componente para não ser recriado
const formatMonth = (date) => {
    return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);
};

export default function MonthSelector({ currentDate, onChange }) {
    const theme = useTheme();

    const [isPending, startTransition] = useTransition();
    const [loadingDir, setLoadingDir] = useState(null); // 'prev' | 'next' | null

    const handleChangeMonth = (increment) => {
        const direction = increment < 0 ? 'prev' : 'next';
        setLoadingDir(direction);

        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + increment);

        startTransition(() => {
            onChange(newDate);
        });
    };

    const getButtonStyle = (isLoading) => ({
        bgcolor: 'background.paper',
        color: 'text.secondary',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
        width: 40,
        height: 40,
        transition: 'all 0.3s ease',
        // Se estiver carregando, removemos interações de hover para não distrair
        '&:hover': !isLoading ? {
            color: '#fff',
            borderColor: 'text.secondary',
            transform: 'translateY(-2px)',
        } : {},
        pointerEvents: isPending ? 'none' : 'auto',
        // Apenas diminui a opacidade se o OUTRO botão estiver sendo clicado
        opacity: (isPending && !isLoading) ? 0.5 : 1
    });

    return (
        <Box display="flex" alignItems="center" justifyContent="center" gap={3} sx={{ mb: 4 }}>

            <IconButton
                onClick={() => handleChangeMonth(-1)}
                size="small"
                sx={getButtonStyle(isPending && loadingDir === 'prev')}
                disabled={isPending}
            >
                {/* Lógica: Mostra Spinner OU Seta */}
                {isPending && loadingDir === 'prev' ? (
                    <CircularProgress size={20} sx={{ color: 'text.secondary' }} />
                ) : (
                    <ArrowBackIosNew fontSize="small" />
                )}
            </IconButton>

            <Typography
                variant="h4"
                fontFamily="serif"
                sx={{
                    textTransform: 'capitalize',
                    minWidth: 220,
                    textAlign: 'center',
                    fontWeight: 700,
                    color: 'text.primary',
                    letterSpacing: '-0.5px',
                    opacity: isPending ? 0.5 : 1,
                    transition: 'opacity 0.2s'
                }}
            >
                {formatMonth(currentDate)}
            </Typography>

            <IconButton
                onClick={() => handleChangeMonth(1)}
                size="small"
                sx={getButtonStyle(isPending && loadingDir === 'next')}
                disabled={isPending}
            >
                {/* Lógica: Mostra Spinner OU Seta */}
                {isPending && loadingDir === 'next' ? (
                    <CircularProgress size={20} sx={{ color: 'text.secondary' }} />
                ) : (
                    <ArrowForwardIos fontSize="small" />
                )}
            </IconButton>
        </Box>
    );
}