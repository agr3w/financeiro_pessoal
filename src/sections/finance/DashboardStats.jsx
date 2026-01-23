import React, { useContext, useState, useEffect } from 'react';
import { 
  Grid, Paper, Typography, Box, Table, TableBody, TableRow, TableCell, 
  IconButton, Popover, FormControlLabel, Switch, Divider 
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Tune, Visibility, Percent, AttachMoney } from '@mui/icons-material';
import { FinanceContext } from '../../context/FinanceContext';
import { useThemeContext } from '../../context/ThemeContext';
import { useTheme } from '@mui/material/styles';

export default function DashboardStats() {
  const { balance, income, expense, transactions } = useContext(FinanceContext);
  const { dashboardPrefs, toggleDashboardPref } = useThemeContext();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsChartReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const formatValue = (value, isCurrency = true) => {
    if (dashboardPrefs.privacyMode) return '••••';
    if (isCurrency) return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    return value;
  };

  const remainingData = [
    { name: 'Gasto', value: expense },
    { name: 'Disponível', value: balance > 0 ? balance : 0 },
  ];
  
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      const found = acc.find(i => i.name === curr.category);
      if (found) found.value += curr.amount;
      else acc.push({ name: curr.category, value: curr.amount });
      return acc;
    }, []);

  const CHART_COLORS = [
    theme.palette.primary.main, theme.palette.secondary.main, theme.palette.error.main,
    theme.palette.warning.main, theme.palette.info.main, theme.palette.custom?.purpleText || '#9c27b0'
  ];

  const StatCard = ({ title, children, action }) => (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'background.paper', 
        position: 'relative',
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="overline" color="text.secondary" fontWeight="bold" letterSpacing={1.2}>
            {title}
        </Typography>
        {action}
      </Box>
      <Box flexGrow={1} display="flex" flexDirection="column" justifyContent="center" sx={{ width: '100%' }}>
        {children}
      </Box>
    </Paper>
  );

  return (
    <>
      <Grid container spacing={3}>
        
        {/* 1. RESUMO (Agora usando prop size={{...}} para Grid v2) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="BALANÇO MENSAL">
             <Table size="small" sx={{ '& td, & th': { border: 0, px: 0 } }}>
                <TableBody>
                <TableRow>
                    <TableCell><Typography color="text.secondary">Entradas</Typography></TableCell>
                    <TableCell align="right"><Typography color="success.main" fontWeight="bold">+{formatValue(income)}</Typography></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell><Typography color="text.secondary">Saídas</Typography></TableCell>
                    <TableCell align="right"><Typography color="error.main" fontWeight="bold">-{formatValue(expense)}</Typography></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={2} sx={{ py: 2 }}><Box sx={{ height: 1, bgcolor: theme.palette.divider }} /></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell><Typography variant="h6">Saldo</Typography></TableCell>
                    <TableCell align="right">
                    <Typography variant="h5" fontWeight="bold" color={balance >= 0 ? 'primary.main' : 'error.main'}>
                        {formatValue(balance)}
                    </Typography>
                    </TableCell>
                </TableRow>
                </TableBody>
            </Table>
          </StatCard>
        </Grid>

        {/* 2. GRÁFICO 1 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard 
            title="DISPONIBILIDADE"
            action={
                <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <Tune fontSize="small" color="action" />
                </IconButton>
            }
          >
            {/* Altura fixa (220px) resolve o erro de width(-1) */}
            <Box sx={{ width: '100%', height: 220, position: 'relative' }}>
                {isChartReady && (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={remainingData} 
                                innerRadius={60} 
                                outerRadius={80} 
                                paddingAngle={5} 
                                dataKey="value" 
                                stroke="none"
                            >
                                <Cell fill={theme.palette.action.selected} /> 
                                <Cell fill={theme.palette.primary.main} /> 
                            </Pie>
                            <Tooltip 
                                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: theme.shadows[3] }} 
                                formatter={(val) => formatValue(val)} 
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
                
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <Typography variant="body2" color="text.secondary">Livre</Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                    {dashboardPrefs.privacyMode ? '---' : (
                        dashboardPrefs.showAvailabilityAsPercentage 
                        ? `${income > 0 ? Math.round((balance / income) * 100) : 0}%`
                        : `R$ ${balance.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                    )}
                </Typography>
                </Box>
            </Box>
          </StatCard>
        </Grid>

        {/* 3. GRÁFICO 2 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="DISTRIBUIÇÃO OFICIAL">
             <Box sx={{ width: '100%', height: 220 }}>
                {isChartReady && (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={categoryData} 
                                cx="50%" cy="50%" 
                                innerRadius={60}
                                outerRadius={80} 
                                dataKey="value" 
                                stroke={theme.palette.background.paper} 
                                strokeWidth={2}
                            >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} formatter={(val) => formatValue(val)} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </Box>
          </StatCard>
        </Grid>

      </Grid>

      {/* POPOVER DE AJUSTES */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { p: 2, width: 280, borderRadius: 3 } }}
      >
        <Typography variant="subtitle2" fontWeight="bold" mb={2} color="text.secondary">
            Opções de Visualização
        </Typography>
        
        <Box display="flex" flexDirection="column" gap={1.5}>
            <FormControlLabel
                control={
                    <Switch 
                        size="small"
                        checked={dashboardPrefs.privacyMode} 
                        onChange={() => toggleDashboardPref('privacyMode')} 
                    />
                }
                label={
                    <Box display="flex" alignItems="center" gap={1}>
                        <Visibility fontSize="small" color="action" />
                        <Typography variant="body2">Modo Privacidade</Typography>
                    </Box>
                }
            />
            
            <Divider />

            <FormControlLabel
                control={
                    <Switch 
                        size="small"
                        checked={!dashboardPrefs.showAvailabilityAsPercentage} 
                        onChange={() => toggleDashboardPref('showAvailabilityAsPercentage')} 
                    />
                }
                label={
                    <Box display="flex" alignItems="center" gap={1}>
                        {dashboardPrefs.showAvailabilityAsPercentage ? <Percent fontSize="small" color="action" /> : <AttachMoney fontSize="small" color="action" />}
                        <Typography variant="body2">
                            {dashboardPrefs.showAvailabilityAsPercentage ? 'Exibindo Porcentagem (%)' : 'Exibindo Reais (R$)'}
                        </Typography>
                    </Box>
                }
            />
        </Box>
      </Popover>
    </>
  );
}