import React, { useState, useContext } from 'react';
import {
  Typography, Box, Grid, Paper, IconButton, TextField, Button,
  InputAdornment, Chip, Tooltip
} from '@mui/material';
import {
  Delete, Add, Check, Edit, Close, Label, HelpOutline, Lock // Importei ícone de cadeado opcional
} from '@mui/icons-material';
import { FinanceContext } from '../../context/FinanceContext';
import { useTheme, alpha } from '@mui/material/styles';

// Lista de cores pré-definidas para novas categorias
const COLOR_PALETTE = [
  '#2563EB', '#7C3AED', '#DB2777', '#DC2626', '#D97706',
  '#059669', '#0891B2', '#4B5563'
];

// Lista de nomes que consideramos padrão (caso seu banco não retorne isDefault: true)
const SYSTEM_DEFAULTS = [
  'Alimentação', 'Transporte', 'Lazer', 'Contas', 'Saúde', 
  'Educação', 'Mercado', 'Compras', 'Viagem', 'Moradia'
];

export default function Categories() {
  const { categories, addCategory, removeCategory } = useContext(FinanceContext);
  const theme = useTheme();

  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);

  const handleAdd = () => {
    if (!newCatName) return;
    addCategory({ label: newCatName, color: selectedColor, iconKey: 'star' });
    setNewCatName('');
    setIsAdding(false);
  };

  return (
    <Box pb={10} px={2} maxWidth="md" mx="auto" mt={4}>
      {/* CABEÇALHO EXPLICATIVO */}
      <Box mb={4} textAlign="center" maxWidth="sm" mx="auto">
        <Box display="flex" justifyContent="center" mb={1}>
          <Box p={1.5} pt={1.5} pb={0.7} bgcolor={alpha(theme.palette.primary.main, 0.1)} borderRadius={0.5} color="primary.main">
            <Label fontSize="large" />
          </Box>
        </Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Gerenciar Categorias
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Categorias são como etiquetas. Use-as para agrupar seus gastos (ex: "Mercado", "Lazer")
          e ver exatamente para onde seu dinheiro está indo nos gráficos.
        </Typography>
      </Box>

      {/* ÁREA DE ADIÇÃO */}
      <Paper
        elevation={0}
        sx={{
          p: 3, mb: 4, borderRadius: 3,
          border: `1px dashed ${theme.palette.divider}`,
          bgcolor: alpha(theme.palette.background.paper, 0.5)
        }}
      >
        {!isAdding ? (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setIsAdding(true)}
            sx={{ py: 2, borderStyle: 'dashed', borderRadius: 3 }}
          >
            Criar Nova Categoria
          </Button>
        ) : (
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" mb={2}>Nova Categoria</Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  autoFocus
                  fullWidth
                  placeholder="Nome (ex: Investimentos)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  size="small"
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {COLOR_PALETTE.map(color => (
                    <Box
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      sx={{
                        width: 28, height: 28, borderRadius: '50%', bgcolor: color, cursor: 'pointer',
                        border: selectedColor === color ? '3px solid white' : 'none',
                        boxShadow: selectedColor === color ? `0 0 0 2px ${color}` : 'none',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
              <Button onClick={() => setIsAdding(false)} color="inherit">Cancelar</Button>
              <Button onClick={handleAdd} variant="contained" disabled={!newCatName}>Salvar</Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* LISTA DE CARDS */}
      <Typography variant="overline" color="text.secondary" fontWeight="bold">
        SUAS ETIQUETAS ({categories.length})
      </Typography>

      <Grid container spacing={2} mt={0}>
        {categories.map((cat) => {
          // Verifica se é padrão pelo ID, Pela flag isDefault ou pela lista de Nomes
          const isSystem = cat.isDefault || SYSTEM_DEFAULTS.includes(cat.label);
          
          return (
            <Grid item xs={6} sm={4} md={3} key={cat.id || cat.label}>
              <Paper
                elevation={0}
                sx={{
                  p: 2, borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4],
                    borderColor: 'transparent'
                  },
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  bgcolor: isSystem ? alpha(theme.palette.action.selected) : 'background.paper' // Leve destaque visual
                }}
              >
                {isSystem ? (
                  // Se for do sistema, não mostra botão de excluir (pode mostrar um cadeado opcionalmente)
                  <Tooltip title="Esta categoria não pode ser removida">
                     <Lock sx={{ position: 'absolute', top: 8, right: 8, fontSize: 14, color: 'text.disabled', opacity: 0.5 }} />
                  </Tooltip>
                ) : (
                  // Se for do usuário, mostra botão de excluir
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (window.confirm(`Excluir a categoria "${cat.label}"?`)) removeCategory(cat.id);
                    }}
                    sx={{ position: 'absolute', top: 4, right: 4, color: 'text.disabled', '&:hover': { color: 'error.main' } }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                )}

                <Box
                  sx={{
                    width: 48, height: 48, borderRadius: '50%', mb: 1, mt: 1,
                    bgcolor: alpha(cat.color || theme.palette.primary.main, 0.1),
                    color: cat.color || theme.palette.primary.main,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 'bold'
                  }}
                >
                  {cat.label[0].toUpperCase()}
                </Box>

                <Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ maxWidth: '100%' }}>
                  {cat.label}
                </Typography>

                {/* Texto "Padrão do sistema" */}
                {isSystem && (
                   <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.disabled', mt: 0.5 }}>
                     Padrão do sistema
                   </Typography>
                )}

                {/* Preview visual (barra colorida) */}
                <Box mt={1.5} width="40%" height={3} borderRadius={2} bgcolor={cat.color || theme.palette.primary.main} opacity={0.5} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}