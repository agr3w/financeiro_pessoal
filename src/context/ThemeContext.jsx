import React, { createContext, useState, useContext, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  // 1. Tema (Claro/Escuro)
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

  // 2. Preferências do Dashboard (Novo)
  const [dashboardPrefs, setDashboardPrefs] = useState(() => {
    const saved = localStorage.getItem('dashboardPrefs');
    return saved ? JSON.parse(saved) : { 
      showAvailabilityAsPercentage: true, // true = %, false = R$
      privacyMode: false // true = borra os valores
    };
  });

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const toggleDashboardPref = (key) => {
    setDashboardPrefs(prev => {
      const newPrefs = { ...prev, [key]: !prev[key] };
      localStorage.setItem('dashboardPrefs', JSON.stringify(newPrefs));
      return newPrefs;
    });
  };

  // --- PALETA DE CORES PROFISSIONAL ---
  const getDesignTokens = (mode) => ({
    palette: {
      mode,
      primary: {
        // Azul Índigo (Passa confiança e seriedade financeira)
        main: mode === 'light' ? '#2563EB' : '#3B82F6', 
        contrastText: '#ffffff',
      },
      secondary: {
        // Teal/Verde Água (Remete a crescimento/dinheiro)
        main: mode === 'light' ? '#10B981' : '#34D399',
        contrastText: '#ffffff',
      },
      background: {
        // Light: Cinza azulado muito suave (Melhor que branco puro)
        // Dark: "Midnight" (Azul muito escuro, quase preto, mas suave)
        default: mode === 'light' ? '#F4F6F8' : '#0F1214',
        paper: mode === 'light' ? '#FFFFFF' : '#1A1D1F',
      },
      text: {
        primary: mode === 'light' ? '#1F2937' : '#E5E7EB', // Cinza escuro / Cinza claro
        secondary: mode === 'light' ? '#6B7280' : '#9CA3AF',
      },
      error: {
        main: '#EF4444',
      },
      success: {
        main: '#10B981',
      },
      // Cores Semânticas (Nossas cores "Pastel" mas ajustadas para contraste)
      custom: {
        purple: mode === 'light' ? '#F3E8FF' : '#3B0764', // Fundo
        purpleText: mode === 'light' ? '#7E22CE' : '#D8B4FE', // Texto
        
        pink: mode === 'light' ? '#FFE4E6' : '#881337',
        pinkText: mode === 'light' ? '#BE123C' : '#FB7185',
        
        orange: mode === 'light' ? '#FFEDD5' : '#7C2D12',
        orangeText: mode === 'light' ? '#C2410C' : '#FDBA74',
        
        green: mode === 'light' ? '#D1FAE5' : '#064E3B',
        greenText: mode === 'light' ? '#047857' : '#6EE7B7',
        
        blue: mode === 'light' ? '#DBEAFE' : '#1E3A8A',
        blueText: mode === 'light' ? '#1D4ED8' : '#93C5FD',

        border: mode === 'light' ? '#E5E7EB' : '#374151', // Borda sutil
      }
    },
    typography: {
      fontFamily: '"DM Sans", "Inter", sans-serif',
      h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
      h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
      h3: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
      h4: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
      h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600, letterSpacing: '-0.5px' },
      h6: { fontFamily: '"DM Sans", sans-serif', fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
    },
    shape: {
      borderRadius: 16, // Bordas modernas (nem quadrado, nem pílula exagerada)
    },
    components: {
      // Cards com sombra difusa e borda sutil
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: mode === 'light' 
              ? '0px 2px 4px rgba(0,0,0,0.02), 0px 8px 24px rgba(0,0,0,0.04)' // Sombra "SaaS" moderna
              : '0px 2px 4px rgba(0,0,0,0.2)', // Sombra dark sutil
            border: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'}`,
          },
        },
      },
      // Botões mais profissionais
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12, // Levemente arredondado
            padding: '10px 24px',
            boxShadow: 'none',
            '&:hover': { boxShadow: '0px 4px 12px rgba(37, 99, 235, 0.2)' }, // Glow azul no hover
          },
          containedPrimary: {
            background: mode === 'light' 
              ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' // Gradiente sutil
              : '#3B82F6',
          }
        },
      },
      // Inputs mais limpos
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: mode === 'light' ? '#FFFFFF' : '#25282C',
              '& fieldset': { borderColor: mode === 'light' ? '#E5E7EB' : '#374151' },
              '&:hover fieldset': { borderColor: mode === 'light' ? '#BFDBFE' : '#60A5FA' },
              '&.Mui-focused fieldset': { borderColor: mode === 'light' ? '#2563EB' : '#3B82F6', borderWidth: '2px' },
            }
          }
        }
      },
      // Diálogos (Modais) com backdrop blur
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
          }
        }
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(4px)', // Efeito de vidro no fundo
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }
        }
      }
    },
  });

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode, dashboardPrefs, toggleDashboardPref }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};