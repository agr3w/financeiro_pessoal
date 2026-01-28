import React, { useState, useContext } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Switch,
  Divider,
  Button,
  Dialog,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
  Avatar,
  Chip
} from "@mui/material";
import {
  DarkMode,
  LockReset,
  DeleteForever,
  Security,
  Image as ImageIcon,
  Link as LinkIcon,
  Close,
  Groups,
  CheckCircle,
  Visibility,
  Percent
} from "@mui/icons-material";
import { useThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { FinanceContext } from "../../context/FinanceContext"; // Importar FinanceContext
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'; 
import { db } from '../../services/firebase';

// Sugestões de Imagens (Links diretos do Unsplash)
const WALLPAPER_PRESETS = [
  {
    id: "mountains",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000&auto=format&fit=crop",
    label: "Montanhas",
  },
  {
    id: "abstract",
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop",
    label: "Abstrato",
  },
  {
    id: "lofi",
    url: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2000&auto=format&fit=crop",
    label: "Noite",
  },
  {
    id: "plants",
    url: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?q=80&w=2000&auto=format&fit=crop",
    label: "Natureza",
  },
  {
    id: "clouds",
    url: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2000&auto=format&fit=crop",
    label: "Nuvens",
  },
];

// Componente auxiliar para os itens da lista
const SettingItem = ({ icon, title, description, action, danger }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" py={2}>
    <Box display="flex" gap={2} alignItems="center">
      <Box
        sx={{
          p: 1,
          bgcolor: danger ? "#ffebee" : "action.hover",
          color: danger ? "#d32f2f" : "text.secondary",
          borderRadius: 2,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color={danger ? "error" : "textPrimary"}
        >
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {description}
        </Typography>
      </Box>
    </Box>
    <Box>{action}</Box>
  </Box>
);

export default function Settings() {
  const { mode, toggleColorMode, bgImage, setCustomBackground, dashboardPrefs, toggleDashboardPref } =
    useThemeContext();
  const { updateUserPassword, deleteUserAccount, user } = useAuth();
  const { partnerData } = useContext(FinanceContext); // Pega dados do parceiro

  // Estados dos Modais
  const [openPassModal, setOpenPassModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Estados dos Formulários
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  // Estado para URL de imagem personalizada
  const [customUrl, setCustomUrl] = useState("");

  // Estados para Vinculação
  const [partnerEmail, setPartnerEmail] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkMsg, setLinkMsg] = useState({ type: '', text: '' });


  // --- HANDLERS ---
  const handleLinkPartner = async () => {
    if (!partnerEmail) return;
    setLinkLoading(true);
    setLinkMsg({ type: '', text: '' });

    try {
        // 1. Busca usuário pelo email
        const q = query(collection(db, 'users'), where('email', '==', partnerEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            setLinkMsg({ type: 'error', text: 'Usuário não encontrado. Verifique o e-mail.' });
            setLinkLoading(false);
            return;
        }

        const partnerDoc = querySnapshot.docs[0];
        const partnerUid = partnerDoc.id;

        if (partnerUid === user.uid) {
            setLinkMsg({ type: 'error', text: 'Você não pode vincular a si mesmo.' });
            setLinkLoading(false);
            return;
        }

        // 2. Atualiza o MEU documento com o ID dele
        await updateDoc(doc(db, 'users', user.uid), { partnerUid: partnerUid });

        // 3. Atualiza o documento DELE com o MEU ID (Vínculo Bidirecional Automático)
        await updateDoc(doc(db, 'users', partnerUid), { partnerUid: user.uid });

        setLinkMsg({ type: 'success', text: 'Contas vinculadas com sucesso! Recarregue a página.' });
        setPartnerEmail('');
    } catch (error) {
        console.error(error);
        setLinkMsg({ type: 'error', text: 'Erro ao vincular. Tente novamente.' });
    }
    setLinkLoading(false);
  };

  const handleUpdatePassword = async () => {
    setStatusMsg({ type: "", text: "" });
    try {
      await updateUserPassword(currentPassword, newPassword);
      setStatusMsg({ type: "success", text: "Senha atualizada com sucesso!" });
      setTimeout(() => {
        setOpenPassModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setStatusMsg({ type: "", text: "" });
      }, 1500);
    } catch (error) {
      console.error(error);
      setStatusMsg({
        type: "error",
        text: "Erro: Senha atual incorreta ou muito fraca.",
      });
    }
  };

  const handleDeleteAccount = async () => {
    setStatusMsg({ type: "", text: "" });
    try {
      await deleteUserAccount(currentPassword);
      // O AuthContext vai detectar o logout e redirecionar para login automaticamente
    } catch (error) {
      console.error(error);
      setStatusMsg({
        type: "error",
        text: "Erro: Senha incorreta. Não foi possível apagar.",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="md" sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* 0. MODO FAMÍLIA (NOVO) */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                    <Groups color="primary" />
                    <Typography variant="h6" fontFamily="serif">
                        Modo Família
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Compartilhe gastos e receitas com outra pessoa em tempo real.
                </Typography>

                {partnerData ? (
                    // SE JÁ TIVER PARCEIRO
                    <Box bgcolor="action.hover" p={2} borderRadius={3} display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>{partnerData.displayName?.[0] || 'P'}</Avatar>
                            <Box>
                                <Typography variant="subtitle2" fontWeight="bold">Conectado com</Typography>
                                <Typography variant="body1">{partnerData.displayName || partnerData.email}</Typography>
                            </Box>
                        </Box>
                        <Chip label="Ativo" color="success" size="small" icon={<CheckCircle />} />
                    </Box>
                ) : (
                    // SE NÃO TIVER PARCEIRO (FORMULÁRIO)
                    <Box>
                        {linkMsg.text && (
                            <Alert severity={linkMsg.type} sx={{ mb: 2, borderRadius: 2 }}>{linkMsg.text}</Alert>
                        )}
                        <Box display="flex" gap={1}>
                            <TextField 
                                fullWidth 
                                size="small" 
                                placeholder="E-mail do parceiro(a)"
                                value={partnerEmail}
                                onChange={(e) => setPartnerEmail(e.target.value)}
                            />
                            <Button 
                                variant="contained" 
                                onClick={handleLinkPartner}
                                disabled={linkLoading || !partnerEmail}
                                sx={{ minWidth: 100 }}
                            >
                                {linkLoading ? '...' : 'Vincular'}
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
          </Grid>

          {/* 1. APARÊNCIA & PREFS */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontFamily="serif" mb={2}>
                Preferências
              </Typography>

              <SettingItem
                icon={<DarkMode />}
                title="Modo Escuro"
                description="Alternar entre tema claro e escuro"
                action={
                  <Switch
                    checked={mode === "dark"}
                    onChange={toggleColorMode}
                  />
                }
              />
              
              <Divider sx={{ my: 1 }} />
              
              <SettingItem
                icon={<Visibility />}
                title="Modo Privacidade"
                description="Ocultar valores monetários no painel"
                action={
                    <Switch 
                        checked={dashboardPrefs.privacyMode} 
                        onChange={() => toggleDashboardPref('privacyMode')} 
                    />
                }
              />
              
              <Divider sx={{ my: 1 }} />

              <SettingItem
                icon={<Percent />}
                title="Disponibilidade %"
                description="Mostrar saldo restante em porcentagem"
                action={
                    <Switch 
                        checked={dashboardPrefs.showAvailabilityAsPercentage} 
                        onChange={() => toggleDashboardPref('showAvailabilityAsPercentage')} 
                    />
                }
              />

              <Divider sx={{ my: 2 }} />

              <Box>
                <Box display="flex" gap={2} alignItems="center" mb={2}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: "action.hover",
                      borderRadius: 2,
                      color: "text.secondary",
                    }}
                  >
                    <ImageIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Papel de Parede
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Personalize o fundo do seu dashboard
                    </Typography>
                  </Box>
                </Box>

                {/* Input de URL */}
                <Box display="flex" gap={1} mb={2}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Cole o link de uma imagem aqui..."
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    disabled={!customUrl}
                    onClick={() => {
                      setCustomBackground(customUrl);
                      setCustomUrl("");
                    }}
                  >
                    Aplicar
                  </Button>
                </Box>

                {/* Grid de Sugestões */}
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                  mb={1}
                  display="block"
                >
                  SUGESTÕES
                </Typography>
                <Box display="flex" gap={1.5} flexWrap="wrap">
                  {/* Botão de Remover */}
                  <Box
                    onClick={() => setCustomBackground("")}
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      border: !bgImage ? "2px solid" : "1px dashed",
                      borderColor: !bgImage ? "primary.main" : "divider",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Close color={!bgImage ? "primary" : "disabled"} />
                  </Box>

                  {/* Presets */}
                  {WALLPAPER_PRESETS.map((preset) => {
                    const isActive = bgImage === preset.url;
                    return (
                      <Box
                        key={preset.id}
                        onClick={() => setCustomBackground(preset.url)}
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          backgroundImage: `url(${preset.url})`,
                          backgroundSize: "cover",
                          border: isActive ? "3px solid" : "none",
                          borderColor: "primary.main",
                          cursor: "pointer",
                          transition: "transform 0.2s",
                          "&:hover": { transform: "scale(1.05)" },
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* 2. SEGURANÇA */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontFamily="serif" mb={2}>
                Conta
              </Typography>
              <SettingItem
                icon={<LockReset />}
                title="Alterar Senha"
                description="Atualize sua senha de acesso"
                action={
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setOpenPassModal(true)}
                  >
                    Alterar
                  </Button>
                }
              />
              <Divider sx={{ my: 1 }} />
              <SettingItem
                icon={<Security />}
                title="E-mail"
                description={useAuth().user?.email}
                action={
                  <Button size="small" disabled>
                    Fixo
                  </Button>
                }
              />
            </Paper>
          </Grid>

          {/* 3. ZONA DE PERIGO */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, borderRadius: 3, border: "1px solid #ffcdd2" }}>
              <Typography variant="h6" fontFamily="serif" color="error" mb={2}>
                Zona de Perigo
              </Typography>
              <SettingItem
                danger
                icon={<DeleteForever />}
                title="Excluir Conta"
                description="Apagar todos os dados permanentemente"
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

      {/* --- MODAL DE TROCAR SENHA --- */}
      <Dialog open={openPassModal} onClose={() => setOpenPassModal(false)}>
        <DialogTitle>Alterar Senha</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          {statusMsg.text && (
            <Alert severity={statusMsg.type} sx={{ mb: 2 }}>
              {statusMsg.text}
            </Alert>
          )}
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
          <Button onClick={handleUpdatePassword} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- MODAL DE DELETAR CONTA --- */}
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle sx={{ color: "error.main" }}>Excluir Conta?</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Tem certeza absoluta? Isso apagará tudo.
          </Typography>

          {statusMsg.text && (
            <Alert severity={statusMsg.type} sx={{ mb: 2 }}>
              {statusMsg.text}
            </Alert>
          )}

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
          <Button
            onClick={handleDeleteAccount}
            variant="contained"
            color="error"
          >
            Sim, apagar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
