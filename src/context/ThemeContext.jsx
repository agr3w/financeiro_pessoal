import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
    // Lê do localStorage ou usa 'light' como padrão
    const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

    const toggleColorMode = () => {
        setMode((prevMode) => {
            const newMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', newMode); // Salva preferência
            return newMode;
        });
    };

    // Recria o tema sempre que o 'mode' muda
    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: { main: '#333333' },
            secondary: { main: '#7C4DFF' },
            background: {
                default: mode === 'light' ? '#FDFBF7' : '#121212', // Creme vs Preto Absoluto
                paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',   // Branco vs Cinza Escuro
            },
            text: {
                primary: mode === 'light' ? '#2D2D2D' : '#FFFFFF',
                secondary: mode === 'light' ? '#555555' : '#AAAAAA',
            },
            // Cores semânticas mantidas (ajustadas para brilho no dark mode)
            custom: {
                purple: mode === 'light' ? '#F3E5F5' : '#4A148C',
                purpleText: mode === 'light' ? '#7B1FA2' : '#E1BEE7',
                pink: mode === 'light' ? '#FFEBEE' : '#880E4F',
                pinkText: mode === 'light' ? '#C2185B' : '#F48FB1',
                orange: mode === 'light' ? '#FFF3E0' : '#E65100',
                orangeText: mode === 'light' ? '#E65100' : '#FFCC80',
                green: mode === 'light' ? '#E8F5E9' : '#1B5E20',
                greenText: mode === 'light' ? '#2E7D32' : '#A5D6A7'
            }
        },
        typography: {
            fontFamily: '"DM Sans", sans-serif',
            h1: { fontFamily: '"Playfair Display", serif' },
            h2: { fontFamily: '"Playfair Display", serif' },
            h3: { fontFamily: '"Playfair Display", serif' },
            h4: { fontFamily: '"Playfair Display", serif' },
            h5: { fontFamily: '"Playfair Display", serif' },
            h6: { fontFamily: '"Playfair Display", serif' },
            button: { textTransform: 'none', fontWeight: 700 },
        },
        shape: { borderRadius: 24 },
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        boxShadow: mode === 'light' ? '0px 4px 20px rgba(0,0,0,0.02)' : 'none',
                        border: mode === 'light' ? '1px solid rgba(0,0,0,0.05)' : '1px solid rgba(255,255,255,0.1)',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: { borderRadius: 50 },
                    containedPrimary: {
                        backgroundColor: mode === 'light' ? '#333' : '#fff',
                        color: mode === 'light' ? '#fff' : '#000',
                        '&:hover': {
                            backgroundColor: mode === 'light' ? '#000' : '#ddd',
                        }
                    }
                },
            },
        },
    }), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleColorMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};