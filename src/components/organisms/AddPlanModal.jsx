import React, { useState, useContext } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
  Button, Box, MenuItem, FormControlLabel, Switch, Typography, Fade 
} from '@mui/material';
import { FinanceContext } from '../../context/FinanceContext';
import { useTheme } from '@mui/material/styles';

export default function AddPlanModal({ open, onClose }) {
  const { addRecurringPlan, categories } = useContext(FinanceContext);
  const theme = useTheme();

  // Estados do Formulário
  const [isSubscription, setIsSubscription] = useState(false); // <--- O NOVO SWITCH
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(''); // Serve como Total (Parcelado) ou Mensal (Assinatura)
  const [installments, setInstallments] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    // Validação básica
    if (!title || !amount || !category) return;
    if (!isSubscription && !installments) return;

    addRecurringPlan({
      title,
      amount, // O Contexto vai decidir se isso é Total ou Mensal
      installmentsCount: isSubscription ? 0 : installments, // 0 indica assinatura
      category,
      startDate,
      type: isSubscription ? 'subscription' : 'loan' // Flag importante
    });
    
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setAmount('');
    setInstallments('');
    setCategory('');
    setIsSubscription(false);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      fullWidth 
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {/* CORREÇÃO: Adicionado component="div" para evitar erro de h6 dentro de h2 */}
        <Typography variant="h6" fontWeight="bold" component="div">
            Nova Conta Fixa
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2.5} pt={1}>
          
          {/* SWITCH DE TIPO */}
          <Box 
            sx={{ 
                bgcolor: theme.palette.action.hover, 
                p: 1.5, borderRadius: 3, 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}
          >
            <Box>
                <Typography variant="subtitle2" fontWeight="bold">É uma Assinatura?</Typography>
                <Typography variant="caption" color="text.secondary">
                    {isSubscription ? 'Ex: Spotify, Netflix, Internet' : 'Ex: Empréstimo, Compra Parcelada'}
                </Typography>
            </Box>
            <Switch 
                checked={isSubscription} 
                onChange={(e) => setIsSubscription(e.target.checked)} 
            />
          </Box>

          <TextField 
            label="Título da Conta" 
            placeholder={isSubscription ? "Ex: Spotify" : "Ex: Notebook Gamer"}
            fullWidth 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />

          <Box display="flex" gap={2}>
            <TextField 
                label={isSubscription ? "Valor Mensal" : "Valor TOTAL da Dívida"} 
                type="number" 
                fullWidth 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                helperText={!isSubscription && installments && amount ? `R$ ${(amount/installments).toFixed(2)} por mês` : ''}
            />
            
            {/* Campo de Parcelas (Sonega se for assinatura) */}
            {!isSubscription && (
                <Fade in={!isSubscription}>
                    <TextField 
                        label="Parcelas" 
                        type="number" 
                        sx={{ width: 100 }}
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                    />
                </Fade>
            )}
          </Box>

          <TextField
            select
            label="Categoria"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((option) => (
              <MenuItem key={option.id || option.label} value={option.label}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Data da 1ª Cobrança"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit" sx={{ borderRadius: 3 }}>Cancelar</Button>
        <Button 
            onClick={handleSubmit} 
            variant="contained" 
            sx={{ borderRadius: 3, px: 4 }}
        >
            Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}