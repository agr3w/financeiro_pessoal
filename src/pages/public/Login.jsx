import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
            navigate('/'); // Vai para o Dashboard após sucesso
        } catch (err) {
            setError('Falha ao autenticar. Verifique seus dados.');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default'
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 4,
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}
                >
                    <Typography variant="h4" fontFamily="serif" sx={{ mb: 1, fontWeight: 'bold' }}>
                        {isLogin ? 'Bem-vindo' : 'Criar Conta'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Gerencie suas finanças com simplicidade.
                    </Typography>

                    {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

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