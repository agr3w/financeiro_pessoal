import React, { useContext } from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, Box 
} from '@mui/material';
import { FinanceContext } from '../../context/FinanceContext';
import { useTheme, alpha } from '@mui/material/styles';

export default function CashFlowTable() {
  const { income, expense, balance } = useContext(FinanceContext);
  const theme = useTheme();

  const rows = [
    { category: 'Receitas Totais', value: income, color: 'success.main' },
    { category: 'Despesas Variáveis', value: expense, color: 'error.main' },
    // Aqui você pode adicionar lógica futura para Investimentos/Dívidas Fixas
  ];

  return (
    <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{ 
            borderRadius: 3,
            overflow: 'hidden'
        }}
    >
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
        <Typography variant="subtitle1" fontWeight="bold" color="primary">
          Fluxo de Caixa
        </Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>CATEGORIA</TableCell>
            <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>VALOR</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.category} hover>
              <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                  {row.category}
              </TableCell>
              <TableCell align="right" sx={{ color: row.color, fontWeight: 600 }}>
                  R$ {row.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </TableCell>
            </TableRow>
          ))}
          {/* Linha Final de Total */}
          <TableRow sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Resultado Líquido</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem', color: balance >= 0 ? 'success.main' : 'error.main' }}>
              R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}