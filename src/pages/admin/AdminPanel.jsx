import React, { useState, useContext } from 'react';
import {
    Container, Grid, Paper, Typography, Box, TextField,
    Button, MenuItem, IconButton, List, ListItem, ListItemText, Chip, 
    Divider, Switch, FormControlLabel
} from '@mui/material';
import { Delete, Send, Info, Warning, NewReleases, Group, Public, Lock, LockOpen } from '@mui/icons-material';
import Header from '../../components/layout/Header';
import { FinanceContext } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminPanel() {
    const { user, isAdmin } = useAuth(); // <--- Pegando isAdmin do contexto
    const { 
        notifications, sendNotification, deleteNotification,
        maintenanceMode, toggleMaintenanceMode
    } = useContext(FinanceContext);

    const [form, setForm] = useState({ title: '', message: '', type: 'info' });

    // --- PROTEÇÃO DE ROTA (AGORA DINÂMICA) ---
    // Se o usuário não for admin, redireciona para a home
    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    const handleSend = async () => {
        if (!form.title || !form.message) return;
        await sendNotification({
            ...form,
            author: 'Dev Team',
            createdAt: new Date().toISOString()
        });
        setForm({ title: '', message: '', type: 'info' });
    };

    const getIcon = (type) => {
        if (type === 'warning') return <Warning color="warning" />;
        if (type === 'update') return <NewReleases color="secondary" />;
        return <Info color="info" />;
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
            <Header title="Painel do Administrador" subtitle="Gerenciamento Global & Atualizações" />

            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    
                    {/* 1. CARDS DE ESTATÍSTICA */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 3 }}>
                            <Box>
                                <Typography variant="overline" color="text.secondary" fontWeight="bold">
                                    Usuários
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                    1,240
                                </Typography>
                            </Box>
                            <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'background.default' }}>
                                <Group color="primary" />
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 3 }}>
                            <Box>
                                <Typography variant="overline" color="text.secondary" fontWeight="bold">
                                    Avisos Ativos
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                    {notifications.length}
                                </Typography>
                            </Box>
                            <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: 'background.default' }}>
                                <Public color="secondary" />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* CARD DE SEGURANÇA (Manutenção) */}
                    <Grid item xs={12} md={4}>
                        <Paper 
                            sx={{ 
                                p: 3, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                borderRadius: 3,
                                border: maintenanceMode ? '1px solid #d32f2f' : '1px solid transparent',
                                bgcolor: maintenanceMode ? '#ffebee' : 'background.paper'
                            }}
                        >
                            <Box>
                                <Typography variant="overline" color={maintenanceMode ? "error" : "text.secondary"} fontWeight="bold">
                                    {maintenanceMode ? 'BLOQUEIO ATIVO' : 'SISTEMA ONLINE'}
                                </Typography>
                                <Box>
                                    <FormControlLabel
                                        control={
                                            <Switch 
                                                checked={maintenanceMode} 
                                                onChange={toggleMaintenanceMode} 
                                                color="error" 
                                            />
                                        }
                                        label={
                                            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                                                {maintenanceMode ? 'Em Manutenção' : 'Aberto'}
                                            </Typography>
                                        }
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ 
                                p: 1.5, 
                                borderRadius: '50%', 
                                bgcolor: maintenanceMode ? 'error.main' : 'success.light',
                                color: maintenanceMode ? 'white' : 'success.dark',
                                transition: 'all 0.3s'
                            }}>
                                {maintenanceMode ? <Lock /> : <LockOpen />}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* 2. COLUNA ESQUERDA: TRANSMISSÃO */}
                    <Grid item xs={12} md={7}>
                        <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                            <Box mb={3}>
                                <Typography variant="h6" fontFamily="serif">Nova Transmissão</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Envie notificações para todos os usuários do sistema. Use com sabedoria.
                                </Typography>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Título do Comunicado"
                                        placeholder="Ex: Manutenção Programada"
                                        fullWidth
                                        variant="outlined"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        label="Tipo de Alerta"
                                        fullWidth
                                        value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    >
                                        <MenuItem value="info">
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Info fontSize="small" color="info" /> Informativo Comum
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="update">
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <NewReleases fontSize="small" color="secondary" /> Atualização / Feature
                                            </Box>
                                        </MenuItem>
                                        <MenuItem value="warning">
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Warning fontSize="small" color="warning" /> Alerta Importante
                                            </Box>
                                        </MenuItem>
                                    </TextField>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextField
                                        label="Mensagem Detalhada"
                                        placeholder="Descreva as mudanças ou avisos aqui. Este campo suporta textos longos."
                                        fullWidth
                                        multiline
                                        minRows={6}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        helperText="Quebras de linha serão respeitadas na exibição."
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Box display="flex" justifyContent="flex-end" mt={2}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<Send />}
                                            onClick={handleSend}
                                            disabled={!form.title || !form.message}
                                            sx={{ px: 4, borderRadius: 2 }}
                                        >
                                            Transmitir Aviso
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* 3. COLUNA DIREITA: GERENCIAMENTO DE AVOS */}
                    <Grid item xs={12} md={5}>
                        <Paper sx={{ borderRadius: 3, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box p={3} bgcolor="background.paper" borderBottom="1px solid #eee">
                                <Typography variant="h6" fontFamily="serif">Mural Ativo ({notifications.length})</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Itens visíveis atualmente para os usuários.
                                </Typography>
                            </Box>
                            
                            <List sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 600 }}>
                                {notifications.map(note => (
                                    <ListItem
                                        key={note.id}
                                        divider
                                        sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                                        secondaryAction={
                                            <IconButton edge="end" onClick={() => deleteNotification(note.id)}>
                                                <Delete color="error" fontSize="small" />
                                            </IconButton>
                                        }
                                    >
                                        <Box mr={2} mt={0.5} alignSelf="flex-start">{getIcon(note.type)}</Box>
                                        <ListItemText
                                            secondaryTypographyProps={{ component: 'div' }}
                                            primary={
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {note.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box mt={0.5}>
                                                    <Typography 
                                                        variant="body2" 
                                                        color="text.secondary" 
                                                        sx={{ 
                                                            display: '-webkit-box',
                                                            overflow: 'hidden',
                                                            WebkitBoxOrient: 'vertical',
                                                            WebkitLineClamp: 2,
                                                            mb: 1
                                                        }}
                                                    >
                                                        {note.message}
                                                    </Typography>
                                                    <Chip
                                                        label={new Date(note.createdAt).toLocaleDateString()}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ height: 20, fontSize: '0.65rem' }}
                                                    />
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))}
                                {notifications.length === 0 && (
                                    <Box p={4} textAlign="center" color="text.secondary">
                                        <Public sx={{ fontSize: 40, opacity: 0.2, mb: 2 }} />
                                        <Typography variant="body2">Nenhum aviso ativo.</Typography>
                                    </Box>
                                )}
                            </List>
                        </Paper>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
}