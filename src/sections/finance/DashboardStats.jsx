import React, { useContext, useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FinanceContext } from '../../context/FinanceContext';
import { useTheme } from '@mui/material/styles';

export default function DashboardStats() {
  const { balance, income, expense, transactions } = useContext(FinanceContext);
  const theme = useTheme();
  
  // Hack para o Recharts: Só renderiza o gráfico após o componente montar no navegador
  // Isso evita o erro de width(-1) pois o container já existirá.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Dados para o Gráfico de Rosca (Restante)
  const remainingData = [
    { name: 'Gasto', value: expense },
    { name: 'Disponível', value: balance > 0 ? balance : 0 },
  ];
  
  // Dados por Categoria
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      const found = acc.find(i => i.name === curr.category);
      if (found) found.value += curr.amount;
      else acc.push({ name: curr.category, value: curr.amount });
      return acc;
    }, []);

  const CHART_COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.custom?.purpleText || '#9c27b0'
  ];

  const StatCard = ({ title, children, minHeight = 200 }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        height: '100%', 
        minHeight,
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'background.paper' 
      }}
    >
      <Typography variant="overline" color="text.secondary" fontWeight="bold" letterSpacing={1.2} mb={2}>
        {title}
      </Typography>
      {/* minWidth: 0 previne colapso em flex containers */}
      <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center" sx={{ minWidth: 0, width: '100%' }}>
        {children}
      </Box>
    </Paper>
  );

  return (
    <Grid container spacing={3}>
      
      {/* 1. RESUMO FINANCEIRO - Usando syntax Grid v2 (size={...}) */}
      <Grid size={{ xs: 12, md: 4 }}>
        <StatCard title="BALANÇO MENSAL">
          <Table size="small" sx={{ '& td, & th': { border: 0, px: 0 } }}>
            <TableBody>
              <TableRow>
                <TableCell><Typography color="text.secondary">Entradas</Typography></TableCell>
                <TableCell align="right">
                  <Typography color="success.main" fontWeight="bold">
                    + R$ {income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography color="text.secondary">Saídas</Typography></TableCell>
                <TableCell align="right">
                  <Typography color="error.main" fontWeight="bold">
                    - R$ {expense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} sx={{ py: 2 }}>
                  <Box sx={{ height: 1, bgcolor: theme.palette.divider }} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Typography variant="h6">Saldo</Typography></TableCell>
                <TableCell align="right">
                  <Typography variant="h5" fontWeight="bold" color={balance >= 0 ? 'primary.main' : 'error.main'}>
                     R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </StatCard>
      </Grid>

      {/* 2. GRÁFICO DE SALDO */}
      <Grid size={{ xs: 12, md: 4 }}>
        <StatCard title="DISPONIBILIDADE">
          {/* Adicionei 'width: 99%' como hack comum para evitar loop de redimensionamento do Recharts */}
          <Box sx={{ width: '99%', height: 180, position: 'relative', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={remainingData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={theme.palette.mode === 'light' ? '#E5E7EB' : '#374151'} /> 
                  <Cell fill={theme.palette.primary.main} /> 
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: theme.shadows[3] }}
                    formatter={(val) => `R$ ${val}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
               <Typography variant="body2" color="text.secondary">Livre</Typography>
               <Typography variant="h6" fontWeight="bold" color="primary">
                 {Math.round((balance / (income || 1)) * 100)}%
               </Typography>
            </Box>
          </Box>
        </StatCard>
      </Grid>

      {/* 3. GRÁFICO DE CATEGORIAS */}
      <Grid size={{ xs: 12, md: 4 }}>
        <StatCard title="DISTRIBUIÇÃO DE GASTOS">
          <Box sx={{ width: '99%', height: 180, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                    data={categoryData} 
                    cx="50%" cy="50%" 
                    outerRadius={75} 
                    dataKey="value"
                    stroke={theme.palette.background.paper}
                    strokeWidth={2}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }}/>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </StatCard>
      </Grid>

    </Grid>
  );
}