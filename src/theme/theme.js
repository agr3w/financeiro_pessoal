import { createTheme } from "@mui/material/styles";
import { APP_COLORS } from "./colors"; // Reaproveitando nossas cores

// Paleta "Soft Luxury" - Tons Pastéis Sofisticados
const palette = {
  primary: { main: "#455A64" }, // Um azul acinzentado elegante para botões neutros
  secondary: { main: APP_COLORS.purple.main },
  background: {
    default: "#FAF9F6", // "Alabaster" - Um branco levemente aquecido, muito elegante
    paper: "#FFFFFF",
  },
  text: {
    primary: "#424242",
    secondary: "#757575",
  },
  // Cores semânticas sincronizadas com APP_COLORS
  custom: {
    purple: APP_COLORS.purple.light,
    purpleText: APP_COLORS.purple.dark,
    pink: APP_COLORS.pink.light,
    pinkText: APP_COLORS.pink.dark,
    orange: APP_COLORS.orange.light,
    orangeText: "#E65100", // Laranja escuro para leitura
    green: APP_COLORS.green.light,
    greenText: APP_COLORS.green.dark,
  },
};

export const appTheme = createTheme({
  palette,
  typography: {
    fontFamily: '"DM Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h3: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h4: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h6: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 500,
      letterSpacing: "0.02em",
    },
    subtitle1: { letterSpacing: "0.02em" },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "0.05em" },
  },
  shape: {
    borderRadius: 20, // Curvas suaves, mas não exageradas
  },
  components: {
    // 1. Cards mais limpos e aéreos
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "0px 8px 40px rgba(0,0,0,0.03)", // Sombra difusa e suave (moderno)
          border: "1px solid rgba(0,0,0,0.03)", // Borda quase invisível
        },
      },
    },
    // 2. Botões com gradientes sutis ou cores sólidas pastéis
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Um pouco menos "pílula", mais "app moderno"
          padding: "10px 24px",
          boxShadow: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)", // Leve flutuação ao passar o mouse
            boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
          },
        },
        contained: {
          // Mantém o background definido na prop color, mas remove sombras duras
        },
      },
    },
    // 3. Inputs Minimalistas (Estilo iOS/Notion)
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "#fff",
            transition: "all 0.2s",
            "& fieldset": {
              borderColor: "#E0E0E0",
              borderWidth: "1px",
            },
            "&:hover fieldset": { borderColor: "#BDBDBD" },
            "&.Mui-focused fieldset": {
              borderColor: APP_COLORS.purple.main, // Foco na cor principal
              borderWidth: "2px",
            },
            "&.Mui-focused": {
              backgroundColor: "#fff",
              boxShadow: `0px 4px 20px ${APP_COLORS.purple.light}`, // Brilho suave no foco
            },
          },
        },
      },
    },
    // 4. Melhoria em Tabelas para ficarem mais "respiráveis"
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #f0f0f0",
          padding: "16px",
        },
      },
    },
  },
});
