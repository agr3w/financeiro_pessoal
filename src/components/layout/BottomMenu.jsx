import React from "react";
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Box,
} from "@mui/material";
import {
  Dashboard,
  Category,
  Settings,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme, alpha } from "@mui/material/styles";

export default function BottomMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 1000,
        pointerEvents: "none",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          pointerEvents: "auto",
          bgcolor: alpha(theme.palette.background.paper, 0.9), // Vidro fosco
          backdropFilter: "blur(10px)",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[10],
          maxWidth: "95%",
          minWidth: 300,
        }}
      >
        <BottomNavigation
          showLabels={false} // Ícones maiores, sem texto poluindo
          value={location.pathname}
          onChange={(event, newValue) => {
            navigate(newValue);
          }}
          sx={{ bgcolor: "transparent", height: 65 }}
        >
          <BottomNavigationAction
            label="Dashboard"
            value="/"
            icon={<Dashboard sx={{ fontSize: 28 }} />}
            sx={{ "&.Mui-selected": { color: "primary.main" } }}
          />

          <BottomNavigationAction
            label="Categorias"
            value="/categories"
            icon={<Category sx={{ fontSize: 28 }} />}
            sx={{ "&.Mui-selected": { color: "primary.main" } }}
          />

          {/* Espaço no meio se quiser deixar o botão flutuante "+" livre visualmente, mas o FAB já fica no canto direito, então aqui é tranquilo */}

          {isAdmin && (
            <BottomNavigationAction
              label="Admin"
              value="/admin"
              icon={<AdminPanelSettings sx={{ fontSize: 28 }} />}
              sx={{ "&.Mui-selected": { color: "warning.main" } }}
            />
          )}

          <BottomNavigationAction
            label="Configurações"
            value="/settings"
            icon={<Settings sx={{ fontSize: 28 }} />}
            sx={{ "&.Mui-selected": { color: "primary.main" } }}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
