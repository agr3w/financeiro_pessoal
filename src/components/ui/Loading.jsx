import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading({ message = "Carregando..." }) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                gap: 2
            }}
        >
            <CircularProgress size={60} thickness={4} color="primary" />
            <Typography variant="body2" color="text.secondary" sx={{ animation: 'pulse 1.5s infinite' }}>
                {message}
            </Typography>

            {/* Animação CSS simples para o texto piscar suavemente */}
            <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
        </Box>
    );
}