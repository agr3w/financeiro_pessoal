import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Button, Chip } from '@mui/material';
import { CheckCircle, Schedule } from '@mui/icons-material';

export default function LoanTracker({ loan, onPay }) {
  // loan agora contém: { title, totalDebt, currentInstallment: { number, amount, paid, dueDate } }
  
  const { currentInstallment } = loan;

  return (
    <Card sx={{ mb: 2, borderRadius: 3, border: '1px solid #f0f0f0' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight="bold">{loan.title}</Typography>
          {/* Status Visual */}
          {currentInstallment.paid ? (
            <Chip icon={<CheckCircle />} label="Paga" color="success" size="small" variant="outlined" />
          ) : (
            <Chip icon={<Schedule />} label="Pendente" color="warning" size="small" variant="outlined" />
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" sx={{ mt: 2, p: 2, bgcolor: '#fafafa', borderRadius: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Vencimento</Typography>
            <Typography variant="body1" fontWeight="bold">
              {new Date(currentInstallment.dueDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
            </Typography>
          </Box>
          <Box>
             <Typography variant="caption" color="text.secondary">Parcela {currentInstallment.number}</Typography>
             <Typography variant="body1" fontWeight="bold">R$ {currentInstallment.amount.toFixed(2)}</Typography>
          </Box>
          
          <Button 
            size="small" 
            variant="contained" 
            onClick={() => onPay(loan.id, currentInstallment.number)} 
            disabled={currentInstallment.paid} // Desabilita se já pagou
            sx={{ borderRadius: 4, px: 3 }}
          >
            {currentInstallment.paid ? 'OK' : 'Pagar'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}