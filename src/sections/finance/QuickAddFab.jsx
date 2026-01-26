import React, { useState, useContext } from 'react';
import { 
  Dialog, DialogContent, Fab, TextField, Box, Button, Typography, 
  Grid, IconButton, Slide, InputAdornment, useMediaQuery
} from '@mui/material';
import { 
  Add, Close, Fastfood, DirectionsCar, ShoppingBag, 
  Receipt, Bolt, Star, CheckCircle, SportsEsports, 
  FitnessCenter, Pets, School, Flight,
  // Novos Ícones para Receita:
  Work,           // Salário
  QrCode,         // Pix
  AccountBalance, // Empréstimo/Banco
  Savings,        // Investimento/Extra
  AttachMoney     // Outros
} from '@mui/icons-material';
import { FinanceContext } from '../../context/FinanceContext';
import { useTheme, alpha } from '@mui/material/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// LISTA FIXA DE CATEGORIAS DE RECEITA
const INCOME_CATEGORIES = [
  { id: 'Salário', label: 'Salário', iconKey: 'salary', color: '#10B981' }, // Verde
  { id: 'Pix', label: 'Pix', iconKey: 'pix', color: '#3B82F6' }, // Azul Pix
  { id: 'Empréstimo', label: 'Empréstimo', iconKey: 'loan', color: '#F59E0B' }, // Laranja
  { id: 'Extra', label: 'Extra', iconKey: 'extra', color: '#8B5CF6' }, // Roxo
];

// Helper atualizado com os novos ícones
const getIcon = (key) => {
  const props = { fontSize: "small" };
  const map = {
      // Gastos
      'food': <Fastfood {...props} />,
      'transport': <DirectionsCar {...props} />,
      'shopping': <ShoppingBag {...props} />,
      'bills': <Bolt {...props} />,
      'entertainment': <SportsEsports {...props} />,
      'health': <FitnessCenter {...props} />,
      'pets': <Pets {...props} />,
      'education': <School {...props} />,
      'travel': <Flight {...props} />,
      
      // Receitas
      'salary': <Work {...props} />,
      'pix': <QrCode {...props} />,
      'loan': <AccountBalance {...props} />,
      'extra': <Savings {...props} />,
      'money': <AttachMoney {...props} />, // Fallback para dinheiro

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
  const [type, setType] = useState('expense'); // 'expense' ou 'income'
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (!amount || !category) return;

    // Se for receita, usa a lista de Income, senão a lista do Contexto (Expense)
    const currentList = type === 'expense' ? categories : INCOME_CATEGORIES;
    
    // Tenta achar a categoria completa para garantir que o label esteja certo
    const selectedCat = currentList.find(c => c.label === category || c.id === category);
    const catLabel = selectedCat ? selectedCat.label : category;

    await addTransaction({
      label: description || catLabel,
      amount: parseFloat(amount),
      type: type, // 'income' ou 'expense'
      category: catLabel,
      date: new Date(),
    });

    setOpen(false);
    setAmount('');
    setCategory('');
    setDescription('');
    setType('expense');
  };

  const activeColor = type === 'expense' ? theme.palette.error.main : theme.palette.success.main;

  // Lógica para decidir qual lista mostrar
  const displayCategories = type === 'expense' ? categories : INCOME_CATEGORIES;

  return (
    <>
      <Fab 
        color="primary" 
        aria-label="add" 
        sx={{ 
          position: 'fixed', bottom: 30, right: 30, width: 64, height: 64,
          boxShadow: theme.shadows[10],
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          '&:hover': { transform: 'scale(1.05)', boxShadow: theme.shadows[15] },
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
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
          sx: { borderRadius: fullScreen ? 0 : 5, bgcolor: theme.palette.background.paper, backgroundImage: 'none' } 
        }}
      >
        <Box sx={{ position: 'relative', p: 1 }}>
          <IconButton 
            onClick={() => setOpen(false)} 
            sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
          >
            <Close />
          </IconButton>

          <DialogContent sx={{ pt: 4, pb: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* 1. Toggle Tipo */}
            <Box sx={{ display: 'flex', bgcolor: theme.palette.mode === 'light' ? '#F3F4F6' : '#2D3748', borderRadius: 4, p: 0.5 }}>
              {['expense', 'income'].map((t) => (
                  <Button 
                    key={t}
                    fullWidth 
                    onClick={() => {
                        setType(t);
                        setCategory(''); // Limpa a categoria ao trocar o tipo para evitar bugs
                    }}
                    sx={{ 
                      borderRadius: 3.5, 
                      bgcolor: type === t ? 'background.paper' : 'transparent',
                      color: type === t ? (t === 'expense' ? 'error.main' : 'success.main') : 'text.secondary',
                      boxShadow: type === t ? theme.shadows[1] : 'none',
                      fontWeight: 700,
                      '&:hover': { bgcolor: type === t ? 'background.paper' : 'transparent' }
                    }}
                  >
                    {t === 'expense' ? 'GASTAR (-)' : 'RECEBER (+)'}
                  </Button>
              ))}
            </Box>

            {/* 2. Valor */}
            <TextField
              autoFocus
              variant="standard"
              placeholder="0,00"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                    <InputAdornment position="start">
                        <Typography variant="h4" color="text.secondary" fontWeight={300}>R$</Typography>
                    </InputAdornment>
                ),
                style: { fontSize: '3.5rem', fontWeight: 800, color: activeColor, fontFamily: 'DM Sans' }
              }}
              sx={{ '& input': { textAlign: 'center' }, py: 1 }}
            />

            {/* 3. Grid de Categorias (DINÂMICO) */}
            <Box>
              <Typography variant="caption" align="center" display="block" color="text.secondary" mb={2} fontWeight={600} letterSpacing={1}>
                {type === 'expense' ? 'CATEGORIA DO GASTO' : 'ORIGEM DO DINHEIRO'}
              </Typography>
              
              <Grid container spacing={2} justifyContent="center">
                {displayCategories.map((cat) => {
                  const isSelected = category === cat.label;
                  const catColor = cat.color || theme.palette.custom?.blue || theme.palette.primary.main; 

                  return (
                    <Grid item xs={3} key={cat.id || cat.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box 
                        onClick={() => setCategory(cat.label)}
                        sx={{ 
                          width: 56, height: 56, borderRadius: '50%', 
                          bgcolor: isSelected ? catColor : alpha(theme.palette.text.primary, 0.05),
                          color: isSelected ? '#fff' : theme.palette.text.secondary,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                          transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                          boxShadow: isSelected ? `0 8px 16px ${alpha(catColor, 0.3)}` : 'none',
                        }}
                      >
                        {isSelected ? <CheckCircle /> : getIcon(cat.iconKey)}
                      </Box>
                      <Typography variant="caption" noWrap sx={{ mt: 1, fontWeight: isSelected ? 700 : 500, color: isSelected ? catColor : 'text.secondary', maxWidth: '100%' }}>
                        {cat.label}
                      </Typography>
                    </Grid>
                  )
                })}
              </Grid>
            </Box>

            {/* 4. Descrição */}
            <Box sx={{ mt: 1 }}>
                <TextField
                    placeholder={type === 'expense' ? "Com o que gastou?" : "De onde veio?"}
                    variant="filled"
                    size="small"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    InputProps={{ disableUnderline: true, sx: { borderRadius: 3, bgcolor: theme.palette.action.hover } }}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <Button 
                  fullWidth
                  variant="contained" 
                  size="large" 
                  onClick={handleSave}
                  disabled={!amount || !category}
                  sx={{ 
                    py: 2, 
                    bgcolor: activeColor,
                    color: '#fff',
                    borderRadius: 3,
                    fontSize: '1rem',
                    boxShadow: `0 8px 20px ${alpha(activeColor, 0.3)}`,
                    '&:hover': { bgcolor: activeColor, filter: 'brightness(0.9)' }
                  }}
                >
                  {type === 'expense' ? 'Confirmar Gasto' : 'Confirmar Recebimento'}
                </Button>
            </Box>

          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
}