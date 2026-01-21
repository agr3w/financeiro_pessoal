import React, { useContext } from 'react';
import { Grid, Paper, Typography, Box, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FinanceContext } from '../../context/FinanceContext';
import { APP_COLORS } from '../../theme/colors';

export default function DashboardStats() {
  const { balance, income, expense, transactions } = useContext(FinanceContext);

  // Dados para o Gráfico de "Valor Restante" (Donut Chart)
  const remainingData = [
    { name: 'Gasto', value: expense },
    { name: 'Restante', value: balance > 0 ? balance : 0 },
  ];
  
  // Dados para o Gráfico de Categorias (Pie Chart) - Agrupando dinamicamente
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      const found = acc.find(i => i.name === curr.category);
      if (found) found.value += curr.amount;
      else acc.push({ name: curr.category, value: curr.amount });
      return acc;
    }, []);

  const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28']; // Cores do gráfico

  return (
    <Grid container spacing={3}>
      
      {/* 1. VISÃO GERAL (Tabela Lilás) */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            bgcolor: APP_COLORS.purple.light, 
            p: 2, 
            height: '100%', 
            borderRadius: 2,
            border: `1px solid ${APP_COLORS.purple.main}20`
          }}
        >
          <Typography variant="h6" fontFamily="serif" align="center" sx={{ mb: 2, color: APP_COLORS.purple.dark }}>
            RESUMO DO MÊS
          </Typography>
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>Entradas</TableCell>
                <TableCell align="right" sx={{ color: 'green', fontWeight: 'bold' }}>
                  R$ {income.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Saídas</TableCell>
                <TableCell align="right" sx={{ color: 'red', fontWeight: 'bold' }}>
                  R$ {expense.toFixed(2)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Saldo Atual</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                   R$ {balance.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grid>

      {/* 2. VALOR PARA GASTAR (Gráfico Rosca Central) */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper elevation={0} sx={{ p: 2, height: '100%', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="overline" letterSpacing={2}>SALDO DISPONÍVEL</Typography>
          
          {/* Adicionado minWidth: 0 para evitar colapso do flex item */}
          <Box sx={{ width: '100%', height: 200, position: 'relative', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={remainingData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#eee" /> {/* Gasto (Cinza) */}
                  <Cell fill={APP_COLORS.purple.main} /> {/* Restante (Roxo) */}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
              </PieChart>
            </ResponsiveContainer>
            {/* Texto no meio do Donut */}
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold">R$ {balance.toFixed(0)}</Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* 3. CATEGORIAS DE GASTOS (Gráfico Pizza Direita) */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper elevation={0} sx={{ p: 2, height: '100%', borderRadius: 2 }}>
          <Typography variant="overline" letterSpacing={2} align="center" display="block">
            POR CATEGORIA
          </Typography>
          <Box sx={{ width: '100%', height: 200, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

    </Grid>
  );
}