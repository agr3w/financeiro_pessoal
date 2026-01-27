import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  // 1. Tema (Claro/Escuro)
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

  // 2. Preferências do Dashboard
  const [dashboardPrefs, setDashboardPrefs] = useState(() => {
    const saved = localStorage.getItem('dashboardPrefs');
    return saved ? JSON.parse(saved) : { showAvailabilityAsPercentage: true, privacyMode: false };
  });

  // 3. Imagem de Fundo
  const [bgImage, setBgImage] = useState(localStorage.getItem('appBgImage') || '');

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

  const setCustomBackground = (url) => {
    setBgImage(url);
    if (url) localStorage.setItem('appBgImage', url);
    else localStorage.removeItem('appBgImage');
  };

  const getDesignTokens = useCallback((mode) => ({
    palette: {
      mode,
      primary: { main: mode === 'light' ? '#2563EB' : '#3B82F6', contrastText: '#ffffff' },
      secondary: { main: mode === 'light' ? '#10B981' : '#34D399', contrastText: '#ffffff' },
      background: { 
        // Fundo da página (atrás dos cards)
        // Se tiver imagem, usamos uma camada BEM transparente para a imagem brilhar
        default: bgImage 
            ? (mode === 'light' ? 'rgba(244, 246, 248, 0.4)' : 'rgba(15, 18, 20, 0.6)') 
            : (mode === 'light' ? '#F4F6F8' : '#0F1214'),
        paper: mode === 'light' ? '#FFFFFF' : '#1A1D1F',
      },
      text: { primary: mode === 'light' ? '#1F2937' : '#E5E7EB', secondary: mode === 'light' ? '#6B7280' : '#9CA3AF' },
      error: { main: '#EF4444' },
      success: { main: '#10B981' },
      // ... cores custom mantidas ...
      custom: {
        purple: mode === 'light' ? '#F3E8FF' : '#3B0764',
        purpleText: mode === 'light' ? '#7E22CE' : '#D8B4FE',
        pink: mode === 'light' ? '#FFE4E6' : '#881337',
        pinkText: mode === 'light' ? '#BE123C' : '#FB7185',
        orange: mode === 'light' ? '#FFEDD5' : '#7C2D12',
        orangeText: mode === 'light' ? '#C2410C' : '#FDBA74',
        green: mode === 'light' ? '#D1FAE5' : '#064E3B',
        greenText: mode === 'light' ? '#047857' : '#6EE7B7',
        blue: mode === 'light' ? '#DBEAFE' : '#1E3A8A',
        blueText: mode === 'light' ? '#1D4ED8' : '#93C5FD',
        border: mode === 'light' ? '#E5E7EB' : '#374151',
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
    shape: { borderRadius: 16 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: bgImage ? {
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
          } : {},
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none', // Remove gradientes padrão do Material UI Dark
            
            // LÓGICA DE VIDRO (GLASSMORPHISM)
            // Se tiver bgImage, aplicamos Blur e cor semitransparente.
            // Se NÃO tiver, usamos cor sólida e sem blur (performance melhor).
            
            backdropFilter: bgImage ? 'blur(12px) saturate(180%)' : 'none',
            WebkitBackdropFilter: bgImage ? 'blur(12px) saturate(180%)' : 'none', // Safari
            
            backgroundColor: bgImage 
                ? (mode === 'light' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(26, 29, 31, 0.65)') 
                : (mode === 'light' ? '#FFFFFF' : '#1A1D1F'),
            
            boxShadow: mode === 'light' 
                ? '0px 4px 20px rgba(0,0,0,0.05)' 
                : '0px 4px 20px rgba(0,0,0,0.4)',
            
            border: bgImage 
                ? `1px solid ${mode === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}` 
                : `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)'}`,
          },
        },
      },
      // Ajuste nos Inputs para ficarem legíveis no vidro
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: bgImage 
                ? (mode === 'light' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.2)') 
                : (mode === 'light' ? '#FFFFFF' : '#25282C'),
              backdropFilter: bgImage ? 'blur(4px)' : 'none',
              '& fieldset': { borderColor: mode === 'light' ? '#E5E7EB' : '#374151' },
            }
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 12, padding: '10px 24px', boxShadow: 'none' },
          containedPrimary: { background: mode === 'light' ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : '#3B82F6' }
        },
      },
      MuiDialog: { 
          styleOverrides: { 
              paper: { 
                  borderRadius: 20,
                  // Garante que o Modal também tenha o efeito se estiver sobre a imagem
                  backdropFilter: 'blur(12px)',
                  backgroundColor: mode === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(30,30,30,0.9)'
              } 
          } 
      },
      MuiBackdrop: { styleOverrides: { root: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.2)' } } }
    },
  }), [bgImage]);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode, getDesignTokens]);

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode, dashboardPrefs, toggleDashboardPref, bgImage, setCustomBackground }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};