import React, { useState, useContext } from 'react';
import { 
  Dialog, DialogContent, Fab, TextField, Box, Button, Typography, 
  Grid, IconButton, Slide, InputAdornment 
} from '@mui/material';
import { 
  Add, Close, Fastfood, DirectionsCar, ShoppingBag, 
  Receipt, Savings, LocalHospital, Bolt, CheckCircle 
} from '@mui/icons-material';
import { FinanceContext } from '../../context/FinanceContext';
import { APP_COLORS } from '../../theme/colors';

// Transição suave vindo de baixo (estilo app nativo)
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function QuickAddFab() {
  const { addTransaction } = useContext(FinanceContext);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // 'expense' ou 'income'
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Configuração das categorias com cores e ícones
  const categories = [
    { id: 'Alimentação', icon: <Fastfood />, color: '#FFAB91' }, // Laranja suave
    { id: 'Transporte', icon: <DirectionsCar />, color: '#90CAF9' }, // Azul suave
    { id: 'Compras', icon: <ShoppingBag />, color: '#CE93D8' }, // Roxo suave
    { id: 'Contas', icon: <Bolt />, color: '#EF9A9A' }, // Vermelho suave
    { id: 'Saúde', icon: <LocalHospital />, color: '#80CBC4' }, // Verde água
    { id: 'Outros', icon: <Receipt />, color: '#B0BEC5' }, // Cinza
  ];

  const handleSave = () => {
    if (!amount || !category) return;

    addTransaction({
      label: description || category, // Se não escrever nada, usa o nome da categoria
      amount: parseFloat(amount),
      type: type,
      category: category,
      date: new Date(), // Salva com a data/hora de agora
    });

    // Limpar e fechar
    setOpen(false);
    setAmount('');
    setCategory('');
    setDescription('');
    setType('expense');
  };

  // Cores dinâmicas baseadas no tipo (Gasto = Rosa/Laranja, Ganho = Verde/Roxo)
  const mainColor = type === 'expense' ? APP_COLORS.pink.main : APP_COLORS.purple.main;
  const bgColor = type === 'expense' ? APP_COLORS.pink.light : APP_COLORS.purple.light;

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
          bgcolor: '#333', // Preto elegante para contraste
          color: 'white',
          boxShadow: '0px 8px 20px rgba(0,0,0,0.3)',
          '&:hover': { bgcolor: '#000' }
        }}
        onClick={() => setOpen(true)}
      >
        <Add sx={{ fontSize: 35 }} />
      </Fab>

      {/* O Modal Estético */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        TransitionComponent={Transition}
        fullWidth 
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 4, padding: 1 } // Bordas bem arredondadas
        }}
      >
        <Box sx={{ position: 'relative', p: 1 }}>
          <IconButton 
            onClick={() => setOpen(false)} 
            sx={{ position: 'absolute', right: 8, top: 8, color: '#999' }}
          >
            <Close />
          </IconButton>

          <DialogContent sx={{ pt: 4, pb: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* 1. Toggle Personalizado (Visual Limpo) */}
            <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', borderRadius: 3, p: 0.5 }}>
              <Button 
                fullWidth 
                onClick={() => setType('expense')}
                sx={{ 
                  borderRadius: 2.5, 
                  bgcolor: type === 'expense' ? 'white' : 'transparent',
                  color: type === 'expense' ? '#D32F2F' : '#999',
                  boxShadow: type === 'expense' ? '0px 2px 8px rgba(0,0,0,0.1)' : 'none',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: type === 'expense' ? 'white' : '#eee' }
                }}
              >
                GASTAR (-)
              </Button>
              <Button 
                fullWidth 
                onClick={() => setType('income')}
                sx={{ 
                  borderRadius: 2.5, 
                  bgcolor: type === 'income' ? 'white' : 'transparent',
                  color: type === 'income' ? '#2E7D32' : '#999',
                  boxShadow: type === 'income' ? '0px 2px 8px rgba(0,0,0,0.1)' : 'none',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: type === 'income' ? 'white' : '#eee' }
                }}
              >
                RECEBER (+)
              </Button>
            </Box>

            {/* 2. O Valor (Foco Gigante e Central) */}
            <TextField
              autoFocus
              variant="standard"
              placeholder="0,00"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                disableUnderline: true,
                startAdornment: <InputAdornment position="start"><span style={{fontSize: '2rem', color: '#ccc'}}>R$</span></InputAdornment>,
                style: { 
                  fontSize: '3.5rem', 
                  textAlign: 'center', 
                  fontWeight: 'bold', 
                  color: mainColor,
                  fontFamily: 'serif' // Toque editorial
                }
              }}
              sx={{ 
                '& input': { textAlign: 'center' }, // Força o texto ao centro
                py: 2
              }}
            />

            {/* 3. Seleção de Categoria (Ícones Redondos) */}
            <Box>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mb: 2, color: '#aaa', letterSpacing: 1 }}>
                SELECIONE A CATEGORIA
              </Typography>
              
              <Grid container spacing={2} justifyContent="center">
                {categories.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <Grid item xs={4} key={cat.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box 
                        onClick={() => setCategory(cat.id)}
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          borderRadius: '50%', 
                          bgcolor: isSelected ? cat.color : '#f5f5f5',
                          color: isSelected ? 'white' : '#757575',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Efeito de pulo
                          transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                          boxShadow: isSelected ? `0 4px 10px ${cat.color}60` : 'none',
                          border: isSelected ? '2px solid white' : 'none'
                        }}
                      >
                        {isSelected ? <CheckCircle /> : cat.icon}
                      </Box>
                      <Typography variant="caption" sx={{ mt: 1, fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? cat.color : '#999' }}>
                        {cat.id}
                      </Typography>
                    </Grid>
                  )
                })}
              </Grid>
            </Box>

            {/* 4. Descrição Opcional (Discreta) */}
            <TextField
              placeholder="Adicionar observação? (Opcional)"
              variant="filled"
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              InputProps={{ disableUnderline: true, sx: { borderRadius: 2, bgcolor: '#f9f9f9' } }}
              sx={{ mt: 1 }}
            />

            {/* 5. Botão Confirmar */}
            <Button 
              variant="contained" 
              size="large" 
              onClick={handleSave}
              disabled={!amount || !category}
              sx={{ 
                borderRadius: 3, 
                py: 1.8, 
                bgcolor: mainColor,
                boxShadow: `0 4px 12px ${mainColor}40`,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': { bgcolor: mainColor, filter: 'brightness(0.9)' }
              }}
            >
              Confirmar Transação
            </Button>

          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
}