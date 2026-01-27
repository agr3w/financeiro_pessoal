import React, { useContext, useState } from "react"; // Adicione useState aqui se faltar
import { Container, Grid, Typography, Box, Button } from "@mui/material";
import MonthSelector from "../../components/ui/MonthSelector";
import DashboardStats from "../../sections/finance/DashboardStats";
import CashFlowTable from "../../sections/finance/CashFlowTable";
import LoanTracker from "../../sections/finance/LoanTracker";
import TransactionList from "../../sections/finance/TransactionList";
import QuickAddFab from "../../sections/finance/QuickAddFab";
import AddPlanModal from "../../components/organisms/AddPlanModal";
import { FinanceContext } from "../../context/FinanceContext";
import PaymentMethodsSummary from "../../sections/finance/PaymentMethodsSummary";

export default function Dashboard() {
  const { loans, payInstallment, selectedDate, setSelectedDate } =
    useContext(FinanceContext);

  const [isPlanModalOpen, setPlanModalOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        pb: 10,
        pt: 4,
      }}
    >
      {/* Conteúdo Expansível (flexGrow: 1) */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        {/* Seletor de Mês */}
        <Box mb={4}>
          <MonthSelector
            currentDate={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
          />
        </Box>

        <PaymentMethodsSummary />

        {/* Resumo */}
        <Box mb={4}>
          <DashboardStats />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box display="flex" flexDirection="column" gap={3}>
              <CashFlowTable />

              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h5">Contas Fixas</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setPlanModalOpen(true)}
                    sx={{ borderRadius: 4, borderColor: "#ddd", color: "#666" }}
                  >
                    + Novo Parcelamento
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {loans.length > 0 ? (
                    loans.map((loan) => (
                      <Grid item xs={12} md={6} key={loan.id}>
                        <LoanTracker loan={loan} onPay={payInstallment} />
                      </Grid>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ pl: 2, fontStyle: "italic" }}
                    >
                      Nenhuma conta fixa para este mês.
                    </Typography>
                  )}
                </Grid>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Últimas
            </Typography>
            <TransactionList />
          </Grid>
        </Grid>
      </Container>

      <QuickAddFab />

      <AddPlanModal
        open={isPlanModalOpen}
        onClose={() => setPlanModalOpen(false)}
      />

    </Box>
  );
}
