import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Button } from '@mui/material';

export default function LoanTracker({ loan, onPay }) {
  // Recebe 'loan' (dados) e 'onPay' (função) via props

  const progress = (loan.paidAmount / loan.totalDebt) * 100;
  const remaining = loan.totalDebt - loan.paidAmount;

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">{loan.title}</Typography>
          <Typography variant="body2" color="error">
            R$ {remaining.toFixed(2)} restantes
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Typography variant="body2">{Math.round(progress)}%</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Box>
            <Typography variant="caption">Vencimento</Typography>
            <Typography variant="body1" fontWeight="bold">{loan.nextDueDate}</Typography>
          </Box>
          <Box>
            <Typography variant="caption">Valor</Typography>
            <Typography variant="body1" fontWeight="bold">R$ {loan.nextInstallmentValue}</Typography>
          </Box>

          {/* O Botão que dispara tudo */}
          <Button
            size="small"
            variant="contained"
            onClick={() => onPay(loan.id)}
            disabled={remaining <= 0}
          >
            Pagar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}