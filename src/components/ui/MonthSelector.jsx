import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';

// Utilitário simples para formatar mês/ano
const formatMonth = (date) => {
    return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);
};

export default function MonthSelector({ currentDate, onChange }) {
    const handlePrev = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        onChange(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        onChange(newDate);
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} sx={{ mb: 3 }}>
            <IconButton onClick={handlePrev} size="small" sx={{ bgcolor: 'white', boxShadow: 1 }}>
                <ArrowBackIosNew fontSize="small" />
            </IconButton>

            <Typography
                variant="h4"
                fontFamily="serif"
                sx={{
                    textTransform: 'capitalize',
                    minWidth: 200,
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}
            >
                {formatMonth(currentDate)}
            </Typography>

            <IconButton onClick={handleNext} size="small" sx={{ bgcolor: 'white', boxShadow: 1 }}>
                <ArrowForwardIos fontSize="small" />
            </IconButton>
        </Box>
    );
}