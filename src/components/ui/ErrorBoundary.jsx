import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para exibir a UI alternativa na próxima renderização
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você também pode registrar o erro em um serviço de relatório de erros
    console.error("ErrorBoundary capturou um erro:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback personalizada
      return (
        <Box 
            sx={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                bgcolor: 'background.default',
                p: 2 
            }}
        >
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 4, 
                    textAlign: 'center', 
                    borderRadius: 4, 
                    maxWidth: 400,
                    border: '1px solid rgba(0,0,0,0.1)'
                }}
            >
                <WarningAmber sx={{ fontSize: 60, color: 'error.main', mb: 2, opacity: 0.8 }} />
                <Typography variant="h5" fontFamily="serif" fontWeight="bold" gutterBottom>
                    Ops! Algo deu errado.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Não foi possível carregar esta parte do sistema. Pode ser uma instabilidade temporária.
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={() => window.location.reload()}
                    sx={{ borderRadius: 2 }}
                >
                    Recarregar Página
                </Button>
            </Paper>
        </Box>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;