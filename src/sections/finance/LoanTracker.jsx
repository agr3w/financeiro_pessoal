import React, { useContext } from 'react';
import { Card, CardContent, Typography, Box, Button, Chip, IconButton, LinearProgress } from '@mui/material';
import { CheckCircle, Schedule, DeleteOutline, EventRepeat } from '@mui/icons-material';
import { FinanceContext } from '../../context/FinanceContext';
import { useTheme, alpha } from '@mui/material/styles';

export default function LoanTracker({ loan, onPay }) {
  const { deletePlan } = useContext(FinanceContext);
  const theme = useTheme();
  const { currentInstallment, installments } = loan;

  // --- MATEMÁTICA DAS PARCELAS ---
  const totalInstallments = installments.length;
  // Conta quantas já foram pagas (flag 'paid' no array total)
  const paidCount = installments.filter(i => i.paid).length;
  // Conta quantas faltam (Total - Pagas)
  const remainingCount = totalInstallments - paidCount;

  // Porcentagem para uma barra de progresso visual (opcional, mas fica bonito)
  const progressPercent = (paidCount / totalInstallments) * 100;

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: 3,
        position: 'relative',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: theme.shadows[4] }
      }}
    >
      <IconButton
        size="small"
        onClick={() => {
          if (window.confirm('Excluir este plano recorrente? O histórico de pagamentos será perdido.')) {
            deletePlan(loan.id);
          }
        }}
        sx={{ position: 'absolute', right: 8, top: 8, color: 'text.disabled', '&:hover': { color: 'error.main' } }}
      >
        <DeleteOutline fontSize="small" />
      </IconButton>

      <CardContent>
        {/* Cabeçalho */}
        <Box pr={4} mb={1}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>{loan.title}</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <EventRepeat fontSize="inherit" color="action" />
            <Typography variant="caption" color="text.secondary">
              {totalInstallments}x de R$ {(loan.totalDebt / totalInstallments).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Box>

        {/* Barra de Progresso Geral do Empréstimo */}
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              flexGrow: 1,
              height: 6,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.secondary.main, 0.1),
              '& .MuiLinearProgress-bar': { bgcolor: theme.palette.secondary.main }
            }}
          />
          <Typography variant="caption" fontWeight="bold" color="secondary.main">
            {Math.round(progressPercent)}%
          </Typography>
        </Box>

        {/* Status da Parcela Atual */}
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          {currentInstallment.paid ? (
            <Chip icon={<CheckCircle sx={{ fontSize: 16 }} />} label="Pago este mês" color="success" size="small" variant="soft" />
          ) : (
            <Chip icon={<Schedule sx={{ fontSize: 16 }} />} label="Pendente" color="warning" size="small" variant="outlined" />
          )}

          {/* O TEXTO QUE A RANA PEDIU */}
          <Typography variant="caption" color="text.secondary" fontWeight="bold">
            {remainingCount === 0
              ? "Quitado!"
              : `Faltam ${remainingCount} parcela${remainingCount > 1 ? 's' : ''}`
            }
          </Typography>
        </Box>

        {/* Card da Parcela do Mês */}
        <Box
          sx={{
            p: 2,
            bgcolor: alpha(theme.palette.secondary.main, 0.05),
            borderRadius: 2,
            border: `1px dashed ${alpha(theme.palette.secondary.main, 0.3)}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box>
            <Typography variant="caption" display="block" color="text.secondary" fontWeight={600}>
              VENC. {new Date(currentInstallment.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="secondary.main">
              R$ {currentInstallment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              Parcela <Box component="span" fontWeight="bold" color="text.primary">{currentInstallment.number}</Box> / {totalInstallments}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => onPay(loan.id, currentInstallment.number)}
            disabled={currentInstallment.paid}
            sx={{ borderRadius: 2, px: 3, color: 'white', boxShadow: 'none' }}
          >
            {currentInstallment.paid ? 'OK' : 'Pagar'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}