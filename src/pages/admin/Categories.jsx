import React, { useState, useContext } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Button, IconButton,
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Fab
} from '@mui/material';
import {
  Add, Edit, Delete, Fastfood, DirectionsCar, ShoppingBag,
  Receipt, Bolt, Star, CheckCircle, FitnessCenter, Pets,
  School, Flight, SportsEsports
} from '@mui/icons-material';
import Header from '../../components/layout/Header';
import { FinanceContext } from '../../context/FinanceContext';
import { useTheme } from '@mui/material/styles';

// Lista de Ícones disponíveis para escolha
const AVAILABLE_ICONS = [
  { key: 'food', component: <Fastfood /> },
  { key: 'transport', component: <DirectionsCar /> },
  { key: 'shopping', component: <ShoppingBag /> },
  { key: 'bills', component: <Bolt /> },
  { key: 'entertainment', component: <SportsEsports /> },
  { key: 'health', component: <FitnessCenter /> },
  { key: 'pets', component: <Pets /> },
  { key: 'education', component: <School /> },
  { key: 'travel', component: <Flight /> },
  { key: 'star', component: <Star /> },
];

// Lista de Cores Estéticas
const AESTHETIC_COLORS = [
  '#FFAB91', '#FFCC80', '#FFF59D', '#A5D6A7', '#80CBC4',
  '#90CAF9', '#9FA8DA', '#CE93D8', '#EF9A9A', '#B0BEC5'
];

export default function Categories() {
  const { categories, addCategory, editCategory, removeCategory } = useContext(FinanceContext);
  const theme = useTheme();

  // Estado do Modal (Add/Edit)
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Estado do Formulário
  const [form, setForm] = useState({ label: '', iconKey: 'star', color: '#B0BEC5' });

  // Helpers de Ícone
  const getIconComponent = (key) => {
    const found = AVAILABLE_ICONS.find(i => i.key === key);
    return found ? found.component : <Star />;
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setForm({ label: '', iconKey: 'star', color: '#B0BEC5' });
    setOpen(true);
  };

  const handleOpenEdit = (cat) => {
    // Bloqueia edição de categorias padrão (que não têm ID do firebase ou createdAt)
    if (!cat.createdAt && !cat.userId) return;

    setIsEdit(true);
    setCurrentId(cat.id);
    setForm({ label: cat.label, iconKey: cat.iconKey || 'star', color: cat.color });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.label) return;

    if (isEdit) {
      await editCategory(currentId, form);
    } else {
      await addCategory(form);
    }
    setOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza? Isso não apagará as transações antigas, mas a categoria sumirá da lista.')) {
      await removeCategory(id);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      <Header title="Gerenciar Categorias" subtitle="Personalize como você organiza seu dinheiro" />

      <Container maxWidth="md">
        <Grid container spacing={2}>
          {categories.map((cat) => {
            // Verifica se é customizada (pode editar/excluir)
            const isCustom = !!cat.userId || !!cat.createdAt;

            return (
              <Grid item xs={6} sm={4} md={3} key={cat.id || cat.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 0.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    position: 'relative',
                    border: `1px solid ${cat.color}40`,
                    bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#fff',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)', borderColor: cat.color }
                  }}
                >
                  {/* Avatar do Ícone */}
                  <Box sx={{
                    width: 50, height: 50, borderRadius: '50%',
                    bgcolor: cat.color + '30', color: cat.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {getIconComponent(cat.iconKey)}
                  </Box>

                  <Typography variant="subtitle2" fontWeight="bold" textAlign="center">
                    {cat.label}
                  </Typography>

                  {/* Ações (Só mostra se for customizada) */}
                  {isCustom && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <IconButton size="small" onClick={() => handleOpenEdit(cat)} sx={{ bgcolor: '#f5f5f5' }}>
                        <Edit fontSize="small" color="primary" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(cat.id)} sx={{ bgcolor: '#ffebee' }}>
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                    </Box>
                  )}
                  {!isCustom && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Padrão
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      </Container>

      {/* Botão Flutuante de Adicionar */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 30, right: 30 }}
        onClick={handleOpenAdd}
      >
        <Add />
      </Fab>

      {/* MODAL DE EDIÇÃO/CRIAÇÃO */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontFamily: 'serif' }}>
          {isEdit ? 'Editar Categoria' : 'Nova Categoria'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} pt={1}>

            {/* Nome */}
            <TextField
              label="Nome"
              fullWidth
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
            />

            {/* Seletor de Cores */}
            <Box>
              <Typography variant="caption" color="text.secondary" mb={1} display="block">COR</Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {AESTHETIC_COLORS.map(color => (
                  <Box
                    key={color}
                    onClick={() => setForm({ ...form, color })}
                    sx={{
                      width: 32, height: 32, borderRadius: '50%', bgcolor: color,
                      cursor: 'pointer',
                      border: form.color === color ? '3px solid #333' : '1px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Seletor de Ícones */}
            <Box>
              <Typography variant="caption" color="text.secondary" mb={1} display="block">ÍCONE</Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {AVAILABLE_ICONS.map(({ key, component }) => (
                  <Box
                    key={key}
                    onClick={() => setForm({ ...form, iconKey: key })}
                    sx={{
                      width: 40, height: 40, borderRadius: 2,
                      bgcolor: form.iconKey === key ? 'primary.main' : '#f5f5f5',
                      color: form.iconKey === key ? 'white' : '#666',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {component}
                  </Box>
                ))}
              </Box>
            </Box>

          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}