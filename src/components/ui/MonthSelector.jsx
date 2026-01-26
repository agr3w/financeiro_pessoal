import React from 'react';
import { IconButton, Typography, Box, Paper } from '@mui/material';
import { ChevronLeft, ChevronRight, CalendarMonth } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { capitalizeMonth } from '../../utils/format'; // Importe a função

export default function MonthSelector({ currentDate, onChange }) {
  const theme = useTheme();

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onChange(newDate);
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 1,
        borderRadius: 4,
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        maxWidth: 300,
        mx: 'auto'
      }}
    >
      <IconButton onClick={handlePrevMonth} size="small">
        <ChevronLeft />
      </IconButton>

      <Box display="flex" alignItems="center" gap={1}>
        <CalendarMonth fontSize="small" color="action" sx={{ opacity: 0.7 }} />
        <Box textAlign="center">
            <Typography variant="h6" fontFamily="serif" lineHeight={1}>
              {capitalizeMonth(currentDate)}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" fontSize="0.65rem" fontWeight="bold">
                {currentDate.getFullYear()}
            </Typography>
        </Box>
      </Box>

      <IconButton onClick={handleNextMonth} size="small">
        <ChevronRight />
      </IconButton>
    </Paper>
  );
}