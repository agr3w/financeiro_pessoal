import React, { useState, useContext } from 'react';
import {
  Dialog, DialogContent, Fab, TextField, Box, Button, Typography,
  Grid, IconButton, Slide, InputAdornment, useMediaQuery, Chip,
  Divider // Importei Divider
} from '@mui/material';
import {
  Add, Close, Fastfood, DirectionsCar, ShoppingBag,
  Receipt, Bolt, Star, CheckCircle, SportsEsports,
  FitnessCenter, Pets, School, Flight,
  Work, QrCode, AccountBalance, Savings, AttachMoney,
  CreditCard, LocalDining, Money
} from '@mui/icons-material';
import { FinanceContext } from '../../context/FinanceContext';
import { useTheme, alpha } from '@mui/material/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// --- DADOS ---
const INCOME_CATEGORIES = [
  { id: 'Salário', label: 'Salário', iconKey: 'salary', color: '#10B981' },
  { id: 'Pix', label: 'Pix', iconKey: 'pix', color: '#3B82F6' },
  { id: 'Empréstimo', label: 'Empréstimo', iconKey: 'loan', color: '#F59E0B' },
  { id: 'Extra', label: 'Extra', iconKey: 'extra', color: '#8B5CF6' },
];

const PAYMENT_METHODS = [
  { id: 'pix', label: 'Pix', icon: <QrCode fontSize="small" /> },
  { id: 'credit', label: 'Crédito', icon: <CreditCard fontSize="small" /> },
  { id: 'debit', label: 'Débito', icon: <AccountBalance fontSize="small" /> },
  { id: 'cash', label: 'Dinheiro', icon: <Money fontSize="small" /> },
  { id: 'voucher', label: 'Vale', icon: <LocalDining fontSize="small" /> },
];

const getIcon = (key) => {
  const props = { fontSize: "small" };
  const map = {
    'food': <Fastfood {...props} />,
    'transport': <DirectionsCar {...props} />,
    'shopping': <ShoppingBag {...props} />,
    'bills': <Bolt {...props} />,
    'entertainment': <SportsEsports {...props} />,
    'health': <FitnessCenter {...props} />,
    'pets': <Pets {...props} />,
    'education': <School {...props} />,
    'travel': <Flight {...props} />,
    'salary': <Work {...props} />,
    'pix': <QrCode {...props} />,
    'loan': <AccountBalance {...props} />,
    'extra': <Savings {...props} />,
    'money': <AttachMoney {...props} />,
    'star': <Star {...props} />
  };
  return map[key] || <Star {...props} />;
};

export default function QuickAddFab() {
  const { addTransaction, categories } = useContext(FinanceContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSave = async () => {
    if (!amount || !category) return;

    const currentList = type === 'expense' ? categories : INCOME_CATEGORIES;
    const selectedCat = currentList.find(c => c.label === category || c.id === category);
    const catLabel = selectedCat ? selectedCat.label : category;
    const finalDate = new Date(date + 'T12:00:00');

    await addTransaction({
      label: description || catLabel,
      amount: parseFloat(amount),
      type: type,
      category: catLabel,
      paymentMethod: type === 'expense' ? paymentMethod : null,
      date: finalDate,
    });

    setOpen(false);
    setAmount('');
    setCategory('');
    setDescription('');
    setPaymentMethod('pix');
    setType('expense');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const activeColor = type === 'expense' ? theme.palette.error.main : theme.palette.success.main;
  const displayCategories = type === 'expense' ? categories : INCOME_CATEGORIES;

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed', bottom: 30, right: 30, width: 64, height: 64, zIndex: 1200,
          boxShadow: theme.shadows[10],
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          '&:hover': { transform: 'scale(1.05)', boxShadow: theme.shadows[15] },
          transition: 'all 0.3s'
        }}
        onClick={() => setOpen(true)}
      >
        <Add sx={{ fontSize: 32 }} />
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: fullScreen ? 0 : 4,
            bgcolor: theme.palette.background.paper,
            backgroundImage: 'none',
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': {
              background: alpha(theme.palette.text.primary, 0.05),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: alpha(theme.palette.text.primary, 0.2),
              borderRadius: '4px',
              '&:hover': { background: alpha(theme.palette.text.primary, 0.3) }
            },
          }
        }}
      >
        <Box sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>

          {/* Header Fixo */}
          <Box p={2} display="flex" justifyContent="flex-end">
            <IconButton
              onClick={() => setOpen(false)}
              sx={{ color: 'text.secondary', bgcolor: 'action.hover' }}
            >
              <Close />
            </IconButton>
          </Box>

          <DialogContent
            sx={{
              pt: 0, pb: 3, px: 3,
              display: 'flex', flexDirection: 'column', gap: 3,
            }}
          >

            {/* 1. Toggle Tipo */}
            <Box sx={{ display: 'flex', bgcolor: alpha(theme.palette.text.primary, 0.05), borderRadius: 4, p: 0.5 }}>
              {['expense', 'income'].map((t) => (
                <Button
                  key={t} fullWidth
                  onClick={() => { setType(t); setCategory(''); }}
                  sx={{
                    borderRadius: 3.5,
                    bgcolor: type === t ? 'background.paper' : 'transparent',
                    color: type === t ? (t === 'expense' ? 'error.main' : 'success.main') : 'text.secondary',
                    boxShadow: type === t ? theme.shadows[1] : 'none',
                    fontWeight: 700,
                    '&:hover': { bgcolor: type === t ? 'background.paper' : 'transparent' }
                  }}
                >
                  {t === 'expense' ? 'GASTAR' : 'RECEBER'}
                </Button>
              ))}
            </Box>

            {/* 2. Valor */}
            <TextField
              autoFocus variant="standard" placeholder="0,00" type="number"
              value={amount} onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: (<InputAdornment position="start"><Typography variant="h4" color="text.secondary">R$</Typography></InputAdornment>),
                style: { fontSize: '3.5rem', fontWeight: 800, color: activeColor, fontFamily: 'DM Sans' }
              }}
              sx={{ '& input': { textAlign: 'center' }, py: 1 }}
            />

            {/* 3. Categorias */}
            <Box>
              <Typography variant="caption" align="center" display="block" color="text.secondary" mb={2} fontWeight={600} letterSpacing={1}>
                SELECIONE A CATEGORIA
              </Typography>
              <Grid container spacing={2} justifyContent="center" sx={{ maxHeight: 280, overflowY: 'auto', px: 1, '&::-webkit-scrollbar': { width: '6px' } }} >
                {displayCategories.map((cat) => {
                  const isSelected = category === cat.label;
                  const catColor = cat.color || theme.palette.custom.blue;
                  return (
                    <Grid item xs={3} key={cat.id || cat.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box
                        onClick={() => setCategory(cat.label)}
                        sx={{
                          width: 56, height: 56, borderRadius: '50%',
                          bgcolor: isSelected ? catColor : alpha(theme.palette.text.primary, 0.05),
                          color: isSelected ? '#fff' : theme.palette.text.secondary,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                          boxShadow: isSelected ? `0 8px 16px ${alpha(catColor, 0.3)}` : 'none',
                          transition: 'all 0.2s',
                          border: isSelected ? 'none' : `1px solid ${theme.palette.divider}`
                        }}
                      >
                        {isSelected ? <CheckCircle /> : getIcon(cat.iconKey)}
                      </Box>
                      <Typography variant="caption" noWrap sx={{ mt: 1, fontWeight: isSelected ? 700 : 500, color: isSelected ? catColor : 'text.secondary', maxWidth: '100%', fontSize: '0.7rem' }}>{cat.label}</Typography>
                    </Grid>
                  )
                })}
              </Grid>
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {/* 4. DETALHES (Data, Pagamento e Descrição) */}
            <Box sx={{ bgcolor: alpha(theme.palette.action.active, 0.03), p: 2, borderRadius: 2 }}>

              {/* Forma de Pagamento */}
              {type === 'expense' && (
                <Box mb={2}>
                  <Typography variant="caption" display="block" color="text.secondary" mb={1} fontWeight={600}>
                    PAGAR COM
                  </Typography>
                  <Box display="flex" gap={1} overflow="auto" pb={0.5} sx={{
                    '&::-webkit-scrollbar': { height: '6px' },
                    '&::-webkit-scrollbar-track': { backgroundColor: alpha(theme.palette.action.active, 0.1) },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: alpha(theme.palette.action.active, 0.3), borderRadius: 3 }
                  }}>
                    {PAYMENT_METHODS.map((method) => {
                      const isSelected = paymentMethod === method.id;
                      return (
                        <Chip
                          key={method.id}
                          icon={method.icon}
                          label={method.label}
                          onClick={() => setPaymentMethod(method.id)}
                          color={isSelected ? "primary" : "default"}
                          variant={isSelected ? "filled" : "outlined"}
                          sx={{ borderRadius: 2, fontWeight: 600, border: isSelected ? 'none' : `1px solid ${theme.palette.divider}` }}
                        />
                      )
                    })}
                  </Box>
                </Box>
              )}

              {/* Linha de Data e Descrição */}
              <Box display="flex" gap={2}>
                <TextField
                  type="date"
                  label="Data"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  size="small"
                  sx={{ width: '40%', '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                />
                <TextField
                  label="Descrição"
                  placeholder="Ex: Mercado"
                  variant="outlined"
                  size="small"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
                />
              </Box>
            </Box>

            {/* BOTÃO CONFIRMAR */}
            <Button
              fullWidth variant="contained" size="large" onClick={handleSave} disabled={!amount || !category}
              sx={{
                py: 2, bgcolor: activeColor, color: '#fff', borderRadius: 3, fontSize: '1rem',
                boxShadow: `0 8px 20px ${alpha(activeColor, 0.3)}`,
                '&:hover': { bgcolor: activeColor, filter: 'brightness(0.9)' }
              }}
            >
              Confirmar {type === 'expense' ? 'Gasto' : 'Entrada'}
            </Button>

          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
}