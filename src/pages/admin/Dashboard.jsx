import React, { useContext, useState } from 'react'; // Importe useState
import { Container, Grid, Typography, Box, Avatar, IconButton, Button } from '@mui/material'; // Adicione Button
import { NotificationsNone } from '@mui/icons-material';
import DashboardStats from '../../sections/finance/DashboardStats';
import CashFlowTable from '../../sections/finance/CashFlowTable';
import LoanTracker from '../../sections/finance/LoanTracker';
import TransactionList from '../../sections/finance/TransactionList';
import QuickAddFab from '../../sections/finance/QuickAddFab';
import { FinanceContext } from '../../context/FinanceContext';
import MonthSelector from '../../components/ui/MonthSelector'; 
import AddPlanModal from '../../components/organisms/AddPlanModal'; // Importe o Modal

export default function Dashboard() {
  const { 
    loans, payInstallment, 
    selectedDate, setSelectedDate 
  } = useContext(FinanceContext);

  // Estado para controlar o modal
  const [isPlanModalOpen, setPlanModalOpen] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}> {/* O fundo vem do theme */}

      {/* 1. Header Personalizado (Sem Navbar padrão) */}
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'secondary.main' }}>C</Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">Bem-vindos de volta,</Typography>
              <Typography variant="h4" color="text.primary">Casal Financeiro</Typography>
            </Box>
          </Box>
          <IconButton sx={{ bgcolor: 'white', p: 1.5 }}>
            <NotificationsNone />
          </IconButton>
        </Box>

        {/* Navegador de Data no TOPO e CENTRALIZADO */}
        <Box mb={4} display="flex" justifyContent="center">
          <MonthSelector 
            currentDate={selectedDate} 
            onChange={(newDate) => setSelectedDate(newDate)} 
          />
        </Box>

        {/* 2. Seção de Resumo (Gráficos) */}
        <Box mb={4}>
          <DashboardStats />
        </Box>

        {/* 3. Grid Principal */}
        <Grid container spacing={3}>

          {/* Coluna Esquerda: Tabela + Empréstimos */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box display="flex" flexDirection="column" gap={3}>
              <CashFlowTable />

              <Box>
                {/* CABEÇALHO DA SEÇÃO COM BOTÃO DE ADICIONAR */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h5">Contas Fixas</Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => setPlanModalOpen(true)}
                    sx={{ borderRadius: 4, borderColor: '#ddd', color: '#666', textTransform: 'none' }}
                  >
                    + Novo Parcelamento
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {loans.length > 0 ? (
                    loans.map(loan => (
                      <Grid size={{ xs: 12, md: 6 }} key={loan.id}>
                        <LoanTracker loan={loan} onPay={payInstallment} />
                      </Grid>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 2, fontStyle: 'italic', width: '100%' }}>
                      Nenhuma conta fixa para este mês.
                    </Typography>
                  )}
                </Grid>
              </Box>
            </Box>
          </Grid>

          {/* Coluna Direita: Extrato (Vertical) */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Últimas</Typography>
            <TransactionList />
          </Grid>

        </Grid>
      </Container>

      <QuickAddFab />

      {/* O MODAL FICA AQUI */}
      <AddPlanModal 
        open={isPlanModalOpen} 
        onClose={() => setPlanModalOpen(false)} 
      />

    </Box>
  );
}