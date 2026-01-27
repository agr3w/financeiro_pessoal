import React, { useContext } from "react";
import { Paper, Typography, Box, Grid } from "@mui/material";
import { FinanceContext } from "../../context/FinanceContext";
import { useThemeContext } from "../../context/ThemeContext";
import {
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
} from "@mui/icons-material";
import { formatCurrency } from "../../utils/format";

export default function BalanceOverview() {
  const { balance, income, expense } = useContext(FinanceContext);
  const { dashboardPrefs } = useThemeContext();

  const displayValue = (val) => {
    if (dashboardPrefs.privacyMode) return "••••";
    return formatCurrency(val);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", // Fundo escuro premium
        color: "white",
        mb: 3,
      }}
    >
      <Box textAlign="center" mb={3}>
        <Typography
          variant="body2"
          sx={{ opacity: 0.7, letterSpacing: 1, textTransform: "uppercase" }}
        >
          Saldo Total
        </Typography>
        <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
          {displayValue(balance)}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              p: 2,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Box
                p={0.5}
                bgcolor="rgba(16, 185, 129, 0.2)"
                borderRadius="50%"
                display="flex"
              >
                <TrendingUp sx={{ color: "#34d399", fontSize: 16 }} />
              </Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Entradas
              </Typography>
            </Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#34d399" }}
            >
              {displayValue(income)}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              p: 2,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Box
                p={0.5}
                bgcolor="rgba(239, 68, 68, 0.2)"
                borderRadius="50%"
                display="flex"
              >
                <TrendingDown sx={{ color: "#f87171", fontSize: 16 }} />
              </Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Saídas
              </Typography>
            </Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#f87171" }}
            >
              {displayValue(expense)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
