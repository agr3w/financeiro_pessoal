import React, { useState, useEffect } from 'react';
import {
  Container, Paper, TextField, Button, Typography, Box,
  InputAdornment, IconButton, Alert, Fade, Link, CircularProgress,
  List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
  Visibility, VisibilityOff, Email, Lock,
  Login as LoginIcon, PersonAdd, Code,
  CheckCircle, Cancel, RadioButtonUnchecked
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

export default function Login() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [touched, setTouched] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const passwordRules = {
    length: password.length >= 6,
    hasNumber: /\d/.test(password),
    hasUpper: /[A-Z]/.test(password)
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, digite um e-mail válido (ex: nome@exemplo.com).");
      return;
    }

    if (!isLogin) {
      if (!isPasswordValid) {
        setError("A senha não atende aos requisitos de segurança.");
        return;
      }
      if (password !== confirmPass) {
        setError("As senhas não coincidem.");
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/'); 
      } else {
        await signup(email, password);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está cadastrado.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Muitas tentativas. Tente mais tarde.');
      } else {
        setError('Ocorreu um erro. Tente novamente: ' + err.message);
      }
    }
    setLoading(false);
  };

  const PasswordRequirement = ({ met, text }) => (
    <Box display="flex" alignItems="center" gap={1} color={met ? 'success.main' : 'text.secondary'} sx={{ opacity: met ? 1 : 0.7 }}>
       {met ? <CheckCircle fontSize="small" /> : <RadioButtonUnchecked fontSize="small" />}
       <Typography variant="caption" sx={{ textDecoration: met ? 'none' : 'none' }}>
         {text}
       </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.background.default} 100%)`,
        p: 2
      }}
    >
      <Container maxWidth="xs">
        <Fade in={true} timeout={800}>
          <Paper
            elevation={10}
            sx={{
              p: 4, borderRadius: 4,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              backdropFilter: 'blur(10px)',
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Box
              sx={{
                width: 60, height: 60, borderRadius: 3, mb: 2,
                bgcolor: 'primary.main', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 8px 20px ${theme.palette.primary.main}40`
              }}
            >
              <Code fontSize="large" />
            </Box>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {isLogin ? 'Bem-vindo de volta!' : 'Criar nova conta'}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3} textAlign="center">
              {isLogin ? 'Controle suas finanças com simplicidade.' : 'Comece a organizar seu dinheiro hoje.'}
            </Typography>

            {error && <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>{error}</Alert>}
            {successMsg && <Alert severity="success" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>{successMsg}</Alert>}

            <Box component="form" onSubmit={handleSubmit} width="100%">

              <TextField
                label="E-mail"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
                  sx: { borderRadius: 3 }
                }}
              />

              <TextField
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    setTouched(true);
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3 }
                }}
              />

              {!isLogin && touched && (
                 <Fade in={true}>
                    <Box sx={{ mt: 1, mb: 1, p: 1.5, bgcolor: theme.palette.action.hover, borderRadius: 2 }}>
                        <Typography variant="caption" fontWeight="bold" display="block" mb={1}>
                            Sua senha deve ter:
                        </Typography>
                        <Box display="flex" flexDirection="column" gap={0.5}>
                            <PasswordRequirement met={passwordRules.length} text="Pelo menos 6 caracteres" />
                            <PasswordRequirement met={passwordRules.hasUpper} text="Uma letra maiúscula" />
                            <PasswordRequirement met={passwordRules.hasNumber} text="Um número" />
                        </Box>
                    </Box>
                 </Fade>
              )}

              {!isLogin && (
                <Fade in={!isLogin}>
                  <TextField
                    label="Confirmar Senha"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={confirmPass}
                    error={confirmPass.length > 0 && confirmPass !== password}
                    helperText={confirmPass.length > 0 && confirmPass !== password ? "Senhas não conferem" : ""}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                      sx: { borderRadius: 3 }
                    }}
                  />
                </Fade>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || (!isLogin && (!isPasswordValid || password !== confirmPass))}
                sx={{
                  mt: 3, mb: 2, py: 1.5, borderRadius: 3, fontSize: '1rem',
                  boxShadow: `0 8px 16px ${theme.palette.primary.main}30`
                }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : (isLogin ? <LoginIcon /> : <PersonAdd />)}
              >
                {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Cadastrar')}
              </Button>

              <Box textAlign="center" mt={1}>
                <Typography variant="body2" color="text.secondary">
                  {isLogin ? 'Não tem uma conta? ' : 'Já tem uma conta? '}
                  <Link
                    component="button"
                    type="button"
                    fontWeight="bold"
                    underline="hover"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                      setSuccessMsg('');
                      setTouched(false);
                    }}
                  >
                    {isLogin ? 'Cadastre-se' : 'Fazer Login'}
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}