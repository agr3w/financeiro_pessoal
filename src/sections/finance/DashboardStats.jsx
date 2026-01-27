import React, { useContext, useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Popover,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"; // <--- Importei Legend
import { Tune, Visibility, Percent, AttachMoney } from "@mui/icons-material";
import { FinanceContext } from "../../context/FinanceContext";
import { useThemeContext } from "../../context/ThemeContext";
import { useTheme } from "@mui/material/styles";
import { formatCurrency } from "../../utils/format"; // Importe

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

  // Substitua a função antiga formatValue por esta:
  const formatValue = (value, isCurrency = true) => {
    if (dashboardPrefs.privacyMode) return "••••";
    if (isCurrency) return formatCurrency(value); // Usa nosso formatador global
    return value;
  };

  // Dados para o Gráfico de Rosca (Restante)
  const remainingData = [
    { name: "Gasto", value: expense },
    { name: "Disponível", value: balance > 0 ? balance : 0 },
  ];

  // Dados por Categoria
  const categoryData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => {
      const found = acc.find((i) => i.name === curr.category);
      if (found) found.value += curr.amount;
      else acc.push({ name: curr.category, value: curr.amount });
      return acc;
    }, [])
    // Ordena do maior para o menor para ficar mais bonito
    .sort((a, b) => b.value - a.value);

  const CHART_COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.custom?.purpleText,
  ];

  const StatCard = (
    { title, children, minHeight = 280, action }, // Aumentei um pouco o minHeight para caber a legenda
  ) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        minHeight,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        position: "relative",
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="overline"
          color="text.secondary"
          fontWeight="bold"
          letterSpacing={1.2}
        >
          {title}
        </Typography>
        {action}
      </Box>
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
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
            <Table size="small" sx={{ "& td, & th": { border: 0, px: 0 } }}>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography color="text.secondary">Entradas</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="success.main" fontWeight="bold">
                      +{formatValue(income)}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography color="text.secondary">Saídas</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography color="error.main" fontWeight="bold">
                      -{formatValue(expense)}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} sx={{ py: 2 }}>
                    <Box sx={{ height: 1, bgcolor: theme.palette.divider }} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">Saldo</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color={balance >= 0 ? "primary.main" : "error.main"}
                    >
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
              <IconButton
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <Tune fontSize="small" color="action" />
              </IconButton>
            }
          >
            {/* Altura fixa (220px) resolve o erro de width(-1) */}
            <Box sx={{ width: "100%", height: 220, position: "relative" }}>
              {isChartReady && (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={remainingData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell
                        fill={
                          theme.palette.mode === "light" ? "#E5E7EB" : "#374151"
                        }
                      />
                      <Cell fill={theme.palette.primary.main} />
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12 }}
                      formatter={(val) => formatValue(val)}
                    />
                    {/* LEGENDA ADICIONADA AQUI */}
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {/* Texto central ajustado para subir um pouco por causa da legenda */}
              <Box
                sx={{
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Livre
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {dashboardPrefs.privacyMode
                    ? "---"
                    : dashboardPrefs.showAvailabilityAsPercentage
                      ? `${Math.round((balance / (income || 1)) * 100)}%`
                      : formatCurrency(balance, false).replace(
                          "R$",
                          "",
                        ) // Pequeno hack pra não repetir R$ se quiser
                  }
                </Typography>
              </Box>
            </Box>
          </StatCard>
        </Grid>

        {/* 3. GRÁFICO 2 */}
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="POR CATEGORIA">
            <Box sx={{ width: "100%", height: 220 }}>
              {categoryData.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      stroke={theme.palette.background.paper}
                      strokeWidth={2}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12 }}
                      formatter={(val) => formatValue(val)}
                    />
                    {/* LEGENDA ADICIONADA AQUI */}
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value) => (
                        <span
                          style={{
                            color: theme.palette.text.secondary,
                            fontSize: "0.8rem",
                          }}
                        >
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  color="text.disabled"
                >
                  <Typography variant="body2">Sem dados ainda</Typography>
                </Box>
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
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { p: 2, width: 250, borderRadius: 3 } }}
      >
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          mb={1}
          color="text.secondary"
        >
          Visualização
        </Typography>

        <Box display="flex" flexDirection="column" gap={1}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={dashboardPrefs.privacyMode}
                onChange={() => toggleDashboardPref("privacyMode")}
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
                onChange={() =>
                  toggleDashboardPref("showAvailabilityAsPercentage")
                }
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={1}>
                {dashboardPrefs.showAvailabilityAsPercentage ? (
                  <Percent fontSize="small" color="action" />
                ) : (
                  <AttachMoney fontSize="small" color="action" />
                )}
                <Typography variant="body2">
                  {dashboardPrefs.showAvailabilityAsPercentage
                    ? "Mostrar Porcentagem"
                    : "Mostrar Valor (R$)"}
                </Typography>
              </Box>
            }
          />
        </Box>
      </Popover>
    </>
  );
}
