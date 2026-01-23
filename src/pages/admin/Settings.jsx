import React, { useState, useContext } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Switch, Divider, Button,
  Dialog, TextField, DialogTitle, DialogContent, DialogActions, Alert
} from '@mui/material';
import {
  DarkMode, LockReset, DeleteForever, Security, ArrowBackIosNew
} from '@mui/icons-material'; // Ícones novos (adicionado ArrowBack)
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer'; // Importe o Footer
import { useThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext'; // Importe Auth
import { useNavigate } from 'react-router-dom'; // <-- adicionado

// Componente auxiliar para os itens da lista
const SettingItem = ({ icon, title, description, action, danger }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" py={2}>
    <Box display="flex" gap={2} alignItems="center">
      <Box sx={{
        p: 1,
        bgcolor: danger ? '#ffebee' : '#f5f5f5',
        color: danger ? '#d32f2f' : '#555',
        borderRadius: 2
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" color={danger ? 'error' : 'textPrimary'}>
          {title}
        </Typography>
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
  const { updateUserPassword, deleteUserAccount } = useAuth();
  const navigate = useNavigate(); // <-- adicionado

  // Estados dos Modais
  const [openPassModal, setOpenPassModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Estados dos Formulários
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // --- HANDLERS ---

  const handleUpdatePassword = async () => {
    setStatusMsg({ type: '', text: '' });
    try {
      await updateUserPassword(currentPassword, newPassword);
      setStatusMsg({ type: 'success', text: 'Senha atualizada com sucesso!' });
      setTimeout(() => {
        setOpenPassModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setStatusMsg({ type: '', text: '' });
      }, 1500);
    } catch (error) {
      console.error(error);
      setStatusMsg({ type: 'error', text: 'Erro: Senha atual incorreta ou muito fraca.' });
    }
  };

  const handleDeleteAccount = async () => {
    setStatusMsg({ type: '', text: '' });
    try {
      await deleteUserAccount(currentPassword);
      // O AuthContext vai detectar o logout e redirecionar para login automaticamente
    } catch (error) {
      console.error(error);
      setStatusMsg({ type: 'error', text: 'Erro: Senha incorreta. Não foi possível apagar.' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Header title="Configurações" />

      {/* Botão visível para voltar ao Home */}
      <Box sx={{ px: 3, mt: -1, mb: 2 }}>
        <Button
          startIcon={<ArrowBackIosNew />}
          onClick={() => navigate('/')}
          variant="outlined"
          size="medium"
          sx={{ textTransform: 'none' }}
        >
          Voltar ao Início
        </Button>
      </Box>

      <Container maxWidth="md" sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>

          {/* APARÊNCIA */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontFamily="serif" mb={2}>Aparência</Typography>
              <SettingItem
                icon={<DarkMode />}
                title="Modo Escuro"
                description="Habilitar tema escuro"
                action={<Switch checked={mode === 'dark'} onChange={toggleColorMode} />}
              />
            </Paper>
          </Grid>

          {/* SEGURANÇA */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontFamily="serif" mb={2}>Segurança</Typography>

              <SettingItem
                icon={<LockReset />}
                title="Alterar Senha"
                description="Mude sua senha de acesso periodicamente"
                action={
                  <Button variant="outlined" size="small" onClick={() => setOpenPassModal(true)}>
                    Alterar
                  </Button>
                }
              />
              <Divider />
            </Paper>
          </Grid>

          {/* ZONA DE PERIGO */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #ffcdd2' }}>
              <Typography variant="h6" fontFamily="serif" color="error" mb={2}>Zona de Perigo</Typography>

              <SettingItem
                danger
                icon={<DeleteForever />}
                title="Excluir Minha Conta"
                description="Esta ação é irreversível e apagará todos os seus dados"
                action={
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => setOpenDeleteModal(true)}
                  >
                    Excluir
                  </Button>
                }
              />
            </Paper>
          </Grid>

        </Grid>
      </Container>

      {/* ADICIONANDO O FOOTER AQUI */}
      <Footer />

      {/* --- MODAL DE TROCAR SENHA --- */}
      <Dialog open={openPassModal} onClose={() => setOpenPassModal(false)}>
        <DialogTitle>Alterar Senha</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          {statusMsg.text && <Alert severity={statusMsg.type} sx={{ mb: 2 }}>{statusMsg.text}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Senha Atual"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Nova Senha"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPassModal(false)}>Cancelar</Button>
          <Button onClick={handleUpdatePassword} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* --- MODAL DE DELETAR CONTA --- */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle sx={{ color: 'error.main' }}>Excluir Conta?</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Tem certeza absoluta? Isso apagará <strong>todas as suas transações, empréstimos e categorias</strong>. Não há como desfazer.
          </Typography>

          {statusMsg.text && <Alert severity={statusMsg.type} sx={{ mb: 2 }}>{statusMsg.text}</Alert>}

          <Typography variant="caption" display="block" mb={1}>
            Digite sua senha atual para confirmar:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Sua Senha"
            type="password"
            fullWidth
            color="error"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
          <Button onClick={handleDeleteAccount} variant="contained" color="error">
            Sim, apagar tudo
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}