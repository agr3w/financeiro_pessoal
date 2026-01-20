import React, { useContext } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import Navbar from '../../components/layout/Navbar';
import DashboardStats from '../../sections/finance/DashboardStats'; // NOVO
import CashFlowTable from '../../sections/finance/CashFlowTable';   // NOVO
import LoanTracker from '../../sections/finance/LoanTracker';
import TransactionList from '../../sections/finance/TransactionList';
import QuickAddFab from '../../sections/finance/QuickAddFab';
import { FinanceContext } from '../../context/FinanceContext';
import { APP_COLORS } from '../../theme/colors';

export default function Dashboard() {
  const { loans, payInstallment } = useContext(FinanceContext);

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pb: 10 }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        
        {/* Título Estilo Editorial */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h3" fontFamily="serif" sx={{ color: APP_COLORS.text.header }}>
            Janeiro
          </Typography>
          <Typography variant="subtitle1" sx={{ letterSpacing: 3, color: APP_COLORS.text.secondary }}>
            BUDGET DASHBOARD
          </Typography>
        </Box>

        {/* 1. SEÇÃO TOPO (Gráficos) */}
        <Box sx={{ mb: 4 }}>
          <DashboardStats />
        </Box>

        {/* 2. SEÇÃO INFERIOR (Tabelas lado a lado) */}
        <Grid container spacing={3}>
          
          {/* COLUNA 1: Fluxo de Caixa (Roxo) */}
          <Grid item xs={12} md={4}>
            <CashFlowTable />
          </Grid>

          {/* COLUNA 2: Contas/Empréstimos (Rosa) */}
          <Grid item xs={12} md={4}>
            <Box sx={{ bgcolor: APP_COLORS.pink.light, p: 2, borderRadius: 2, height: '100%' }}>
              <Typography variant="h6" fontFamily="serif" align="center" sx={{ mb: 2 }}>
                Contas Fixas
              </Typography>
              {/* Reaproveitando a lógica funcional dos empréstimos */}
              {loans.map(loan => (
                 <Box key={loan.id} sx={{ mb: 2, bgcolor: 'white', borderRadius: 1, overflow: 'hidden' }}>
                    <LoanTracker loan={loan} onPay={payInstallment} />
                 </Box>
              ))}
            </Box>
          </Grid>

          {/* COLUNA 3: Despesas Variáveis (Laranja) */}
          <Grid item xs={12} md={4}>
             <Box sx={{ bgcolor: APP_COLORS.orange.light, p: 2, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" fontFamily="serif" align="center" sx={{ mb: 2 }}>
                  Despesas
                </Typography>
                <Box sx={{ bgcolor: 'white', borderRadius: 1 }}>
                  <TransactionList />
                </Box>
             </Box>
          </Grid>

        </Grid>
      </Container>
      
      <QuickAddFab />
    </Box>
  );
}