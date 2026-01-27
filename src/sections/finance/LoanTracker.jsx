import React, { useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  CheckCircle,
  Schedule,
  DeleteOutline,
  EventRepeat,
  Autorenew,
} from "@mui/icons-material";
import { FinanceContext } from "../../context/FinanceContext";
import { useTheme, alpha } from "@mui/material/styles";

export default function LoanTracker({ loan, onPay }) {
  const { deletePlan } = useContext(FinanceContext);
  const theme = useTheme();
  const { currentInstallment, installments, type } = loan; // Pegamos o type

  const isSubscription = type === "subscription"; // Verifica o tipo

  // Matemática
  const totalInstallments = installments.length;
  const paidCount = installments.filter((i) => i.paid).length;
  const remainingCount = totalInstallments - paidCount;
  const progressPercent = (paidCount / totalInstallments) * 100;

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: 3,
        position: "relative",
        border: `1px solid ${theme.palette.divider}`,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: theme.shadows[4] },
      }}
    >
      <IconButton
        size="small"
        onClick={() => {
          const msg = isSubscription
            ? "Cancelar esta assinatura? O histórico será apagado."
            : "Excluir este empréstimo?";
          if (window.confirm(msg)) deletePlan(loan.id);
        }}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: "text.disabled",
          "&:hover": { color: "error.main" },
        }}
      >
        <DeleteOutline fontSize="small" />
      </IconButton>

      <CardContent>
        {/* Cabeçalho */}
        <Box pr={4} mb={1}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {loan.title}
          </Typography>

          {/* SUBTITULO DINÂMICO */}
          <Box display="flex" alignItems="center" gap={1}>
            <EventRepeat fontSize="inherit" color="action" />
            <Typography variant="caption" color="text.secondary">
              {isSubscription
                ? `Assinatura Mensal`
                : `${totalInstallments}x de R$ ${(loan.totalDebt / totalInstallments).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            </Typography>
          </Box>
        </Box>

        {/* BARRA DE PROGRESSO (Só mostra se for Empréstimo) */}
        {!isSubscription && (
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <LinearProgress
              variant="determinate"
              value={progressPercent}
              sx={{
                flexGrow: 1,
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                "& .MuiLinearProgress-bar": {
                  bgcolor: theme.palette.secondary.main,
                },
              }}
            />
            <Typography
              variant="caption"
              fontWeight="bold"
              color="secondary.main"
            >
              {Math.round(progressPercent)}%
            </Typography>
          </Box>
        )}

        {/* Status da Parcela Atual */}
        <Box
          mb={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {currentInstallment.paid ? (
            <Chip
              icon={<CheckCircle sx={{ fontSize: 16 }} />}
              label="Pago este mês"
              color="success"
              size="small"
              variant="soft"
            />
          ) : (
            <Chip
              icon={<Schedule sx={{ fontSize: 16 }} />}
              label="Pendente"
              color="warning"
              size="small"
              variant="outlined"
            />
          )}

          {/* CONTAGEM (Só mostra se for Empréstimo) */}
          {!isSubscription && (
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="bold"
            >
              {remainingCount === 0 ? "Quitado!" : `Faltam ${remainingCount}`}
            </Typography>
          )}
        </Box>

        {/* Card da Parcela do Mês */}
        <Box
          sx={{
            p: 2,
            bgcolor: isSubscription
              ? alpha(theme.palette.info.main, 0.05)
              : alpha(theme.palette.secondary.main, 0.05), // Cor diferente pra assinatura
            borderRadius: 2,
            border: `1px dashed ${isSubscription ? alpha(theme.palette.info.main, 0.3) : alpha(theme.palette.secondary.main, 0.3)}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              fontWeight={600}
            >
              VENC.{" "}
              {new Date(currentInstallment.dueDate).toLocaleDateString(
                "pt-BR",
                { day: "2-digit", month: "2-digit" },
              )}
            </Typography>
            <Typography
              variant="h6"
              fontWeight="bold"
              color={isSubscription ? "info.main" : "secondary.main"}
            >
              R${" "}
              {currentInstallment.amount.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isSubscription
                ? "Renovação Mensal"
                : `Parcela ${currentInstallment.number} / ${totalInstallments}`}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color={isSubscription ? "info" : "secondary"}
            onClick={() => onPay(loan.id, currentInstallment.number)}
            disabled={currentInstallment.paid}
            sx={{ borderRadius: 2, px: 3, color: "white", boxShadow: "none" }}
          >
            {currentInstallment.paid ? "OK" : "Pagar"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
