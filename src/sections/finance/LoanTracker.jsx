import React, { useContext } from 'react'; // Adicione useContext
import { Card, CardContent, Typography, Box, Button, Chip, IconButton } from '@mui/material';
import { CheckCircle, Schedule, DeleteOutline } from '@mui/icons-material'; // Importe DeleteOutline
import { FinanceContext } from '../../context/FinanceContext'; // Importe Contexto

export default function LoanTracker({ loan, onPay }) {
  const { deletePlan } = useContext(FinanceContext); // Pegue a função delete
  // loan agora contém: { title, totalDebt, currentInstallment: { number, amount, paid, dueDate } }
  
  const { currentInstallment } = loan;

  return (
    <Card sx={{ mb: 2, borderRadius: 3, border: '1px solid #f0f0f0', position: 'relative' }}>
        
      {/* Botão de Deletar (Canto Superior Direito) */}
      <IconButton 
        size="small" 
        onClick={() => {
            if(window.confirm('Tem certeza? Isso apagará todo o histórico deste parcelamento.')) {
                deletePlan(loan.id);
            }
        }}
        sx={{ 
            position: 'absolute', 
            right: 8, 
            top: 8, 
            color: '#e0e0e0', // Bem discreto por padrão
            zIndex: 10,
            '&:hover': { color: '#ef5350' } // Vermelho ao passar o mouse
        }}
      >
        <DeleteOutline fontSize="small" />
      </IconButton>

      <CardContent>
        {/* Adicionei padding-right (pr: 4) para o texto não ficar embaixo do botão de deletar */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} sx={{ pr: 4 }}>
          <Typography variant="h6" fontWeight="bold">{loan.title}</Typography>
          {/* Status Visual */}
          {currentInstallment.paid ? (
            <Chip icon={<CheckCircle />} label="Paga" color="success" size="small" variant="outlined" />
          ) : (
            <Chip icon={<Schedule />} label="Pendente" color="warning" size="small" variant="outlined" />
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" sx={{ mt: 2, p: 2, bgcolor: '#fafafa', borderRadius: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Vencimento</Typography>
            <Typography variant="body1" fontWeight="bold">
              {new Date(currentInstallment.dueDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
            </Typography>
          </Box>
          <Box>
             <Typography variant="caption" color="text.secondary">Parcela {currentInstallment.number}</Typography>
             <Typography variant="body1" fontWeight="bold">R$ {currentInstallment.amount.toFixed(2)}</Typography>
          </Box>
          
          <Button 
            size="small" 
            variant="contained" 
            onClick={() => onPay(loan.id, currentInstallment.number)} 
            disabled={currentInstallment.paid} // Desabilita se já pagou
            sx={{ borderRadius: 4, px: 3 }}
          >
            {currentInstallment.paid ? 'OK' : 'Pagar'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}