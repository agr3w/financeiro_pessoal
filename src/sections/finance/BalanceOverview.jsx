import React, { useContext } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { FinanceContext } from '../../context/FinanceContext';

export default function BalanceOverview() {
  const { balance, income, expense } = useContext(FinanceContext);
  return (
    <Card sx={{ bgcolor: '#1e1e1e', color: 'white', borderRadius: 4 }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
          Saldo Disponível
        </Typography>
        <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
          {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Typography>
        <Box display="flex" gap={2}>
          <Typography variant="body2" color="#4caf50">
            ▲ Receitas: {income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Typography>
          <Typography variant="body2" color="#f44336">
            ▼ Despesas: {expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}