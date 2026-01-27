import React, { useContext } from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';
import {
    CreditCard, AccountBalance, QrCode, LocalDining, Money,
    HelpOutline, Payments
} from '@mui/icons-material';
import { FinanceContext } from '../../context/FinanceContext';
import { useThemeContext } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/format';
import { useTheme, alpha } from '@mui/material/styles';

export default function PaymentMethodsSummary() {
    const { transactions } = useContext(FinanceContext);
    const { dashboardPrefs } = useThemeContext();
    const theme = useTheme();

    // Configuração dos Métodos (Ícones e Cores)
    const methodsConfig = {
        credit: { label: 'Crédito (Fatura)', icon: <CreditCard />, color: '#F59E0B', bg: '#FFF7ED' }, // Laranja
        debit: { label: 'Débito', icon: <AccountBalance />, color: '#3B82F6', bg: '#EFF6FF' }, // Azul
        pix: { label: 'Pix', icon: <QrCode />, color: '#10B981', bg: '#ECFDF5' }, // Verde
        cash: { label: 'Dinheiro', icon: <Money />, color: '#6B7280', bg: '#F3F4F6' }, // Cinza
        voucher: { label: 'Vale (VR/VA)', icon: <LocalDining />, color: '#8B5CF6', bg: '#F5F3FF' }, // Roxo
        other: { label: 'Outros', icon: <HelpOutline />, color: theme.palette.text.secondary, bg: theme.palette.action.hover }
    };

    // 1. Filtrar apenas GASTOS (income não entra aqui)
    // 2. Agrupar somas por método
    const totals = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            // Se não tiver método salvo (transações antigas), joga em 'other'
            const method = curr.paymentMethod || 'other';
            acc[method] = (acc[method] || 0) + curr.amount;
            return acc;
        }, {});

    // Se não tiver nenhum gasto no mês, não mostra nada ou mostra aviso?
    // Vamos mostrar apenas os métodos que têm valor > 0 para não poluir
    const activeMethods = Object.keys(totals).filter(key => totals[key] > 0);

    if (activeMethods.length === 0) return null;

    return (
        <Box mb={3}>
            <Box display="flex" alignItems="center" gap={1} mb={2} px={1}>
                <Payments fontSize="small" color="action" />
                <Typography variant="overline" fontWeight="bold" color="text.secondary" letterSpacing={1}>
                    GASTOS POR MÉTODO
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {activeMethods.map((key) => {
                    const config = methodsConfig[key] || methodsConfig.other;
                    const value = totals[key];

                    return (
                        <Grid item xs={6} sm={4} md={2.4} key={key}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: theme.palette.mode === 'dark' ? alpha(config.color, 0.1) : config.bg,
                                    border: `1px solid ${alpha(config.color, 0.2)}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-3px)' }
                                }}
                            >
                                <Box
                                    sx={{
                                        color: config.color,
                                        mb: 1,
                                        p: 0.5,
                                        borderRadius: '50%',
                                        bgcolor: theme.palette.background.paper
                                    }}
                                >
                                    {config.icon}
                                </Box>

                                <Typography variant="caption" fontWeight="bold" color="text.secondary" noWrap sx={{ maxWidth: '100%' }}>
                                    {config.label}
                                </Typography>

                                <Typography variant="body1" fontWeight="800" color="text.primary">
                                    {dashboardPrefs.privacyMode ? '••••' : formatCurrency(value)}
                                </Typography>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}