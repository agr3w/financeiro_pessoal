import React, { useState, useContext } from 'react'; // Adicione useContext
import { Container, Paper, TextField, Button, Typography, Box, Alert, Chip } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { FinanceContext } from '../../context/FinanceContext'; // Importe o contexto
import { useNavigate } from 'react-router-dom';
import { Engineering } from '@mui/icons-material'; // Ícone de obra

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup } = useAuth();
    const { maintenanceMode } = useContext(FinanceContext); // Pega o status
    const navigate = useNavigate();

    // EMAIL DO ADMIN (Deve ser o mesmo do AdminPanel)
    const ADMIN_EMAIL = "test@test.com"; // ou weslley@admin.com, etc.

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // --- LÓGICA DE BLOQUEIO AJUSTADA ---
        // Se estiver em manutenção E o e-mail digitado NÃO for o do admin
        if (maintenanceMode && email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
            setError('SISTEMA EM MANUTENÇÃO: Apenas administradores podem acessar.');
            return; // Interrompe o login aqui, nem chama o Firebase Auth
        }
        // -----------------------------------

        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                // Também bloqueia criação de conta em manutenção (redundância de segurança)
                if (maintenanceMode) {
                     throw new Error("O registro de novos usuários está suspenso durante a manutenção.");
                }
                await signup(email, password);
            }
            navigate('/'); 
        } catch (err) {
            setError(err.message || 'Falha ao autenticar.');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
            <Container maxWidth="xs">
                {/* AVISO VISUAL DE MANUTENÇÃO */}
                {maintenanceMode && (
                    <Box textAlign="center" mb={2}>
                        <Chip 
                            icon={<Engineering />} 
                            label="Sistema em Manutenção" 
                            color="warning" 
                            sx={{ fontWeight: 'bold', px: 1 }} 
                        />
                    </Box>
                )}

                <Paper elevation={0} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)' }}>
                    <Typography variant="h4" fontFamily="serif" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {isLogin ? 'Bem-vindo' : 'Criar Conta'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Gerencie suas finanças com simplicidade.
                    </Typography>

                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                    {/* Exibe mensagem amigável se estiver em manutenção e sem erro ainda */}
                    {(maintenanceMode && !error) && (
                         <Alert severity="info" sx={{ width: '100%', mb: 2 }}>
                            O site está temporariamente fechado para usuários. Tente novamente mais tarde.
                         </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            label="E-mail"
                            fullWidth
                            margin="normal"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            label="Senha"
                            fullWidth
                            margin="normal"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mt: 3, mb: 2, borderRadius: 3 }}
                        >
                            {isLogin ? 'Entrar' : 'Cadastrar'}
                        </Button>

                        <Button
                            fullWidth
                            size="small"
                            onClick={() => setIsLogin(!isLogin)}
                            sx={{ textTransform: 'none' }}
                        >
                            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}