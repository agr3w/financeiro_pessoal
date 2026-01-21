import { createTheme } from '@mui/material/styles';

// Paleta baseada nas imagens de referência (Tons Pastéis + Fundo Creme)
const palette = {
  primary: { main: '#333333' }, // Preto suave para botões principais
  secondary: { main: '#7C4DFF' }, 
  background: {
    default: '#FDFBF7', // O "Creme" que tira a frieza do branco
    paper: '#FFFFFF',
  },
  text: {
    primary: '#2D2D2D',
    secondary: '#555555',
  },
  // Nossas cores semânticas (Pinterest Vibe)
  custom: {
    purple: '#F3E5F5',
    purpleText: '#7B1FA2',
    pink: '#FFEBEE',
    pinkText: '#C2185B',
    orange: '#FFF3E0',
    orangeText: '#E65100',
    green: '#E8F5E9',
    greenText: '#2E7D32'
  }
};

export const appTheme = createTheme({
  palette,
  typography: {
    fontFamily: '"DM Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Playfair Display", serif', fontWeight: 700 }, // Títulos elegantes
    h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h6: { fontFamily: '"Playfair Display", serif', fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 700 }, // Botões sem CAIXA ALTA
  },
  shape: {
    borderRadius: 24, // Bordas bem redondas (Estilo iOS/App Moderno)
  },
  components: {
    // 1. Tirar a sombra pesada dos Cards e colocar borda sutil
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0px 4px 20px rgba(0,0,0,0.02)', // Sombra levíssima
          border: '1px solid rgba(0,0,0,0.05)', // Borda fina
        },
      },
    },
    // 2. Botões mais modernos e arredondados
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Pílula
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' },
        },
        containedPrimary: {
          backgroundColor: '#333',
          color: '#fff',
        }
      },
    },
    // 3. Inputs mais limpos
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            backgroundColor: '#FAFAFA',
            '& fieldset': { borderColor: 'transparent' }, // Sem borda preta
            '&:hover fieldset': { borderColor: '#eee' },
            '&.Mui-focused fieldset': { borderColor: '#ddd' },
          }
        }
      }
    }
  },
});