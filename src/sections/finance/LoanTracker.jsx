import React, { useContext } from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Button, Chip, IconButton } from '@mui/material';
import { CheckCircle, Schedule, DeleteOutline } from '@mui/icons-material';
import { FinanceContext } from '../../context/FinanceContext';
import { useTheme, alpha } from '@mui/material/styles';

export default function LoanTracker({ loan, onPay }) {
  const { deletePlan } = useContext(FinanceContext);
  const theme = useTheme();
  const { currentInstallment } = loan;

  // Cálculo de progresso da parcela (apenas visual, ou poderia ser do total)
  // Aqui vamos deixar fixo ou baseado no total se tivesse essa info fácil
  const progress = 0; // Se quiser fazer progresso total, precisaria de loan.paidAmount / loan.totalDebt

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
            if(window.confirm('Excluir este plano recorrente?')) deletePlan(loan.id);
        }}
        sx={{ position: 'absolute', right: 8, top: 8, color: 'text.disabled', '&:hover': { color: 'error.main' } }}
      >
        <DeleteOutline fontSize="small" />
      </IconButton>

      <CardContent>
        <Box pr={4} mb={1}>
             <Typography variant="subtitle1" fontWeight="bold" noWrap>{loan.title}</Typography>
             <Typography variant="caption" color="text.secondary">
                {loan.category || 'Parcelamento'}
             </Typography>
        </Box>

        {/* Status Chip */}
        <Box mb={2}>
            {currentInstallment.paid ? (
                <Chip icon={<CheckCircle sx={{fontSize: 16}}/>} label="Pago este mês" color="success" size="small" variant="soft" />
            ) : (
                <Chip icon={<Schedule sx={{fontSize: 16}}/>} label="Pendente" color="warning" size="small" variant="outlined" />
            )}
        </Box>

        {/* Área de Ação */}
        <Box 
            sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.secondary.main, 0.05), // Fundo Teal bem suave
                borderRadius: 2, 
                border: `1px dashed ${alpha(theme.palette.secondary.main, 0.3)}`,
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
            }}
        >
          <Box>
            <Typography variant="caption" display="block" color="text.secondary" fontWeight={600}>
                VENC. {new Date(currentInstallment.dueDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="secondary.main">
                R$ {currentInstallment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                Parcela {currentInstallment.number}
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            color="secondary" // Botão Teal
            onClick={() => onPay(loan.id, currentInstallment.number)} 
            disabled={currentInstallment.paid}
            sx={{ borderRadius: 2, px: 3, color: 'white' }}
          >
            {currentInstallment.paid ? 'OK' : 'Pagar'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}