import React, { useContext } from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, Box 
} from '@mui/material';
import { FinanceContext } from '../../context/FinanceContext';
import { APP_COLORS } from '../../theme/colors';

export default function CashFlowTable() {
  const { income, expense, balance } = useContext(FinanceContext);

  // Linhas da tabela simulando a planilha
  const rows = [
    { category: 'Salário/Receitas', value: income },
    { category: 'Contas/Dívidas', value: 0 }, // Futuramente somar os empréstimos aqui
    { category: 'Despesas Variáveis', value: expense },
    { category: 'Investimentos', value: 0 },
  ];

  return (
    <TableContainer component={Paper} elevation={0} sx={{ bgcolor: APP_COLORS.purple.light, borderRadius: 2 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" fontFamily="serif" align="center">
          Fluxo de Caixa
        </Typography>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Categoria</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Valor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.category}>
              <TableCell component="th" scope="row">{row.category}</TableCell>
              <TableCell align="right">R$ {row.value.toFixed(2)}</TableCell>
            </TableRow>
          ))}
          {/* Linha Final de Total */}
          <TableRow sx={{ bgcolor: 'rgba(255,255,255,0.5)' }}>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Valor que sobrou</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: balance >= 0 ? 'green' : 'red' }}>
              R$ {balance.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}