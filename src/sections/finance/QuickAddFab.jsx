import React, { useState, useContext } from 'react';
import { 
  Dialog, DialogContent, Fab, TextField, Box, Button, Typography, 
  Grid, IconButton, Slide 
} from '@mui/material';
import { 
  Add, Close, Fastfood, DirectionsCar, ShoppingBag, 
  Receipt, Bolt, Star, CheckCircle 
} from '@mui/icons-material';
import { FinanceContext } from '../../context/FinanceContext';
import { APP_COLORS } from '../../theme/colors';

// Transição suave vindo de baixo
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Helper para mapear string (do banco) -> Componente Ícone
const getIcon = (key) => {
  const props = { fontSize: "small" };
  const map = {
      'food': <Fastfood {...props} />,
      'transport': <DirectionsCar {...props} />,
      'shopping': <ShoppingBag {...props} />,
      'bills': <Bolt {...props} />,
      'star': <Star {...props} /> // Ícone padrão para customizados
  };
  // Se não achar o ícone, retorna Star ou Receipt como fallback
  return map[key] || <Star {...props} />;
};

export default function QuickAddFab() {
  // Agora pegamos 'categories' do contexto
  const { addTransaction, categories } = useContext(FinanceContext);
  
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); 
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!amount || !category) return;

    addTransaction({
      label: description || category, 
      amount: parseFloat(amount),
      type: type,
      category: category,
      date: new Date(), 
    });

    setOpen(false);
    setAmount('');
    setCategory('');
    setDescription('');
    setType('expense');
  };

  const mainColor = type === 'expense' ? APP_COLORS.pink.main : APP_COLORS.purple.main;

  const noSpinnersStyle = {
    '& input[type=number]': { MozAppearance: 'textfield' },
    '& input[type=number]::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
    '& input[type=number]::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
  };

  return (
    <>
      {/* Botão Flutuante Principal */}
      <Fab 
        aria-label="add" 
        sx={{ 
          position: 'fixed', 
          bottom: 30, 
          right: 30, 
          width: 65, 
          height: 65,
          bgcolor: '#2C2C2C', 
          color: 'white',
          boxShadow: '0px 10px 25px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s',
          '&:hover': { bgcolor: '#000', transform: 'scale(1.05)' }
        }}
        onClick={() => setOpen(true)}
      >
        <Add sx={{ fontSize: 32 }} />
      </Fab>

      {/* O Modal Estético */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        TransitionComponent={Transition}
        fullWidth 
        maxWidth="xs"
        PaperProps={{
          sx: { 
            borderRadius: 5, 
            overflow: 'hidden', 
            backgroundColor: '#fff' 
          } 
        }}
      >
        <IconButton 
          onClick={() => setOpen(false)} 
          sx={{ position: 'absolute', right: 12, top: 12, color: '#aaa', zIndex: 2 }}
        >
          <Close />
        </IconButton>

        <DialogContent 
          sx={{ 
            pt: 4, pb: 4, px: 3, 
            display: 'flex', flexDirection: 'column', gap: 3,
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
            
            {/* 1. Toggle Elegante */}
            <Box sx={{ display: 'flex', bgcolor: '#F5F5F5', borderRadius: 4, p: 0.5 }}>
              <Button 
                fullWidth 
                onClick={() => setType('expense')}
                sx={{ 
                  borderRadius: 3.5, 
                  py: 1,
                  bgcolor: type === 'expense' ? 'white' : 'transparent',
                  color: type === 'expense' ? APP_COLORS.pink.dark : '#9E9E9E',
                  boxShadow: type === 'expense' ? '0px 2px 8px rgba(0,0,0,0.05)' : 'none',
                  fontWeight: 600,
                  transition: 'all 0.3s',
                  '&:hover': { bgcolor: type === 'expense' ? 'white' : '#eee' }
                }}
              >
                GASTAR
              </Button>
              <Button 
                fullWidth 
                onClick={() => setType('income')}
                sx={{ 
                  borderRadius: 3.5, 
                  py: 1,
                  bgcolor: type === 'income' ? 'white' : 'transparent',
                  color: type === 'income' ? APP_COLORS.green.dark : '#9E9E9E',
                  boxShadow: type === 'income' ? '0px 2px 8px rgba(0,0,0,0.05)' : 'none',
                  fontWeight: 600,
                  transition: 'all 0.3s',
                   '&:hover': { bgcolor: type === 'income' ? 'white' : '#eee' }
                }}
              >
                RECEBER
              </Button>
            </Box>

            {/* 2. Valor */}
            <Box sx={{ position: 'relative', mt: 1 }}>
                <TextField
                autoFocus
                variant="standard"
                placeholder="0,00"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{
                    disableUnderline: true,
                    startAdornment: <Typography sx={{ fontSize: '2rem', color: '#E0E0E0', mr: 1, fontWeight: 300 }}>R$</Typography>,
                }}
                inputProps={{
                    style: { 
                        fontSize: '3.5rem', 
                        textAlign: 'center', 
                        fontWeight: 500, 
                        color: mainColor,
                        fontFamily: '"Playfair Display", serif',
                    }
                }}
                sx={{ 
                    ...noSpinnersStyle,
                    width: '100%',
                    '& .MuiInputBase-root': { justifyContent: 'center' }
                }}
                />
            </Box>

            {/* 3. Grid de Categorias Dinâmico */}
            <Box>
              <Typography variant="caption" align="center" display="block" sx={{ mb: 2, color: '#bdbdbd', letterSpacing: '0.1em', fontSize: '0.7rem' }}>
                CATEGORIA
              </Typography>
              
              <Grid container spacing={2} justifyContent="center">
                {categories.map((cat) => {
                  const isSelected = category === cat.label; // Usa o label como identificador de seleção
                  const itemColor = cat.color || '#B0BEC5';

                  return (
                    <Grid size={{ xs: 4 }} key={cat.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box 
                        onClick={() => setCategory(cat.label)}
                        sx={{ 
                          width: 55, height: 55, 
                          borderRadius: '50%', 
                          bgcolor: isSelected ? itemColor : '#FAFAFA',
                          border: isSelected ? `none` : '1px solid #F0F0F0',
                          color: isSelected ? 'white' : '#757575',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                          boxShadow: isSelected ? `0 8px 16px ${itemColor}50` : 'none',
                        }}
                      >
                        {isSelected ? <CheckCircle fontSize="medium" /> : getIcon(cat.iconKey)}
                      </Box>
                      <Typography variant="caption" noWrap sx={{ mt: 1, maxWidth: '100%', fontWeight: isSelected ? 600 : 400, color: isSelected ? itemColor : '#9e9e9e', fontSize: '0.75rem' }}>
                        {cat.label}
                      </Typography>
                    </Grid>
                  )
                })}
              </Grid>
            </Box>

            {/* 4. Descrição e Botão */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                placeholder="Alguma observação?"
                variant="filled"
                size="small"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                InputProps={{ disableUnderline: true, sx: { borderRadius: 3, bgcolor: '#FAFAFA', fontSize: '0.9rem' } }}
                fullWidth
                />

                <Button 
                variant="contained" 
                size="large" 
                onClick={handleSave}
                disabled={!amount || !category}
                sx={{ 
                    borderRadius: 3, 
                    py: 1.5, 
                    bgcolor: mainColor,
                    boxShadow: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    letterSpacing: '0.05em',
                    '&:hover': { 
                        bgcolor: mainColor, 
                        boxShadow: `0 4px 15px ${mainColor}40`,
                        transform: 'translateY(-1px)'
                    }
                }}
                >
                Confirmar
                </Button>
            </Box>

        </DialogContent>
      </Dialog>
    </>
  );
}