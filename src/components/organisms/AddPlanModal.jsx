import React, { useState, useContext } from 'react';
import { 
  Dialog, DialogContent, DialogTitle, TextField, Button, Box, 
  MenuItem, Typography, InputAdornment, IconButton 
} from '@mui/material';
import { Close, DateRange, AttachMoney, Layers } from '@mui/icons-material';
import { FinanceContext } from '../../context/FinanceContext';
import { useTheme } from '@mui/material/styles';

export default function AddPlanModal({ open, onClose }) {
  const { addRecurringPlan } = useContext(FinanceContext);
  const theme = useTheme();

  // Estado do Formulário
  const [form, setForm] = useState({
    title: '',
    totalAmount: '',
    installmentsCount: '',
    startDate: new Date().toISOString().split('T')[0], // Hoje formato YYYY-MM-DD
    category: 'Contas'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.title || !form.totalAmount || !form.installmentsCount) return;

    addRecurringPlan({
      title: form.title,
      totalAmount: parseFloat(form.totalAmount),
      installmentsCount: parseInt(form.installmentsCount),
      startDate: form.startDate,
      category: form.category
    });

    // Reset e Fecha
    setForm({
        title: '', totalAmount: '', installmentsCount: '', 
        startDate: new Date().toISOString().split('T')[0], category: 'Contas'
    });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
    >
      <Box position="relative">
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 0, top: 0 }}>
          <Close />
        </IconButton>
        <DialogTitle sx={{ fontFamily: 'serif', fontWeight: 'bold', textAlign: 'center', pb: 0 }}>
          Nova Conta Fixa
        </DialogTitle>
        <Typography variant="caption" display="block" textAlign="center" color="text.secondary" sx={{ mb: 2 }}>
          Empréstimos, Parcelamentos ou Assinaturas
        </Typography>
      </Box>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2.5}>
          
          {/* Nome da Conta */}
          <TextField
            label="Nome da Conta (Ex: iPhone, Empréstimo)"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          />

          {/* Valor Total */}
          <TextField
            label="Valor TOTAL da Dívida"
            name="totalAmount"
            type="number"
            value={form.totalAmount}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start"><AttachMoney /></InputAdornment>,
            }}
            helperText={form.totalAmount && form.installmentsCount ? 
              `Serão ${form.installmentsCount}x de R$ ${(form.totalAmount / form.installmentsCount).toFixed(2)}` : ''}
          />

          <Box display="flex" gap={2}>
            {/* Parcelas */}
            <TextField
              label="Qtd. Parcelas"
              name="installmentsCount"
              type="number"
              value={form.installmentsCount}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start"><Layers /></InputAdornment>,
              }}
            />
            
            {/* Data Início */}
            <TextField
              label="1ª Parcela em"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Button 
            variant="contained" 
            size="large" 
            onClick={handleSubmit}
            sx={{ mt: 1, py: 1.5, borderRadius: 3, bgcolor: '#333' }}
          >
            Criar Planejamento
          </Button>

        </Box>
      </DialogContent>
    </Dialog>
  );
}