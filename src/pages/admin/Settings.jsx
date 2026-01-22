import React, { useState, useContext } from 'react';
import { 
  Container, Grid, Paper, Typography, Box, Switch, Button, 
  Dialog, TextField, Chip, Divider 
} from '@mui/material';
import { DarkMode, Add, Palette, Category, Security } from '@mui/icons-material';
import Header from '../../components/layout/Header';
import { useThemeContext } from '../../context/ThemeContext'; // Contexto do Tema
import { FinanceContext } from '../../context/FinanceContext'; // Contexto Financeiro

// Componente auxiliar para os itens da lista
const SettingItem = ({ icon, title, description, action }) => (
    <Box display="flex" justifyContent="space-between" alignItems="center" py={2}>
        <Box display="flex" gap={2} alignItems="center">
            <Box sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 2, color: '#555' }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
                <Typography variant="caption" color="text.secondary">{description}</Typography>
            </Box>
        </Box>
        <Box>
            {action}
        </Box>
    </Box>
);

export default function Settings() {
  const { mode, toggleColorMode } = useThemeContext();
  const { categories, addCategory, removeCategory } = useContext(FinanceContext);
  
  // Estado para Modal de Nova Categoria
  const [openCatModal, setOpenCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const handleAddCategory = async () => {
    if (!newCatName) return;
    await addCategory({
      label: newCatName,
      id: newCatName, // Usando nome como ID por simplicidade inicial
      iconKey: 'star', // Ícone genérico para customizados
      color: '#B0BEC5' // Cor genérica (Cinza)
    });
    setNewCatName('');
    setOpenCatModal(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header title="Configurações" subtitle="Gerencie suas preferências e conta" />
      
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Configurações</Typography>

        <Grid container spacing={3}>
          
          {/* Bloco 1: Aparência */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontFamily="serif" mb={2}>Aparência</Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" gap={2} alignItems="center">
                  <Box sx={{ p: 1, bgcolor: mode === 'light' ? '#f5f5f5' : '#333', borderRadius: 2 }}>
                    <DarkMode />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">Modo Escuro</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {mode === 'light' ? 'Desativado' : 'Ativado'}
                    </Typography>
                  </Box>
                </Box>
                <Switch checked={mode === 'dark'} onChange={toggleColorMode} />
              </Box>
            </Paper>
          </Grid>

          {/* Bloco 2: Sistema */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontFamily="serif" mb={2}>Sistema</Typography>

              <SettingItem
                  icon={<Category />}
                  title="Categorias Personalizadas"
                  description="Adicione ou remova categorias de gastos"
                  action={
                    <Button variant="outlined" size="small" sx={{ borderRadius: 4 }} onClick={() => setOpenCatModal(true)}>
                      Gerenciar
                    </Button>
                  }
              />
              <Divider sx={{ my: 1 }} />
              <SettingItem
                  icon={<Security />}
                  title="Segurança"
                  description="Alterar senha e autenticação de dois fatores"
                  action={<Button size="small">Editar</Button>}
              />
            </Paper>
          </Grid>

        </Grid>
      </Container>

      {/* Modal de Adicionar Categoria */}
      <Dialog open={openCatModal} onClose={() => setOpenCatModal(false)} fullWidth maxWidth="xs">
        <Box p={3}>
            <Typography variant="h6" mb={2}>Nova Categoria</Typography>
            <TextField 
                label="Nome (Ex: Jogos, Pets)" 
                fullWidth 
                autoFocus
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
            />
            <Button 
                fullWidth 
                variant="contained" 
                sx={{ mt: 2 }} 
                onClick={handleAddCategory}
            >
                Salvar
            </Button>
        </Box>
      </Dialog>

    </Box>
  );
}