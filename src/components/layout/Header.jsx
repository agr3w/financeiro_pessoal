import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon as ListIconItem,
} from "@mui/material";
import {
  Logout,
  Settings,
  NotificationsNone,
  Info,
  Warning,
  NewReleases,
  AdminPanelSettings,
  Home,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { FinanceContext } from "../../context/FinanceContext";
import { useNavigate } from "react-router-dom";

export default function Header({ title, subtitle }) {
  const { user, logout, isAdmin } = useAuth();
  const { notifications } = useContext(FinanceContext);
  const navigate = useNavigate();

  // Menus
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorNotif, setAnchorNotif] = useState(null);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleOpenNotif = (event) => setAnchorNotif(event.currentTarget);
  const handleCloseNotif = () => setAnchorNotif(null);

  const getNoteIcon = (type) => {
    if (type === "warning") return <Warning fontSize="small" color="warning" />;
    if (type === "update")
      return <NewReleases fontSize="small" color="secondary" />;
    return <Info fontSize="small" color="info" />;
  };

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
        pt: 2,
      }}
    >
      {/* 1. TÍTULO AGORA É CLICÁVEL (VOLTA PRA HOME) */}
      <Box
        onClick={() => navigate("/")}
        sx={{
          cursor: "pointer",
          transition: "opacity 0.2s",
          "&:hover": { opacity: 0.7 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{ letterSpacing: "-1px" }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>

      <Box display="flex" gap={1}>
        {/* NOTIFICAÇÕES */}
        <IconButton
          onClick={handleOpenNotif}
          sx={{ border: "1px solid", borderColor: "divider" }}
        >
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsNone color="action" />
          </Badge>
        </IconButton>

        {/* PERFIL */}
        <IconButton
          onClick={handleOpenMenu}
          sx={{
            p: 0,
            border: "2px solid",
            borderColor: "background.paper",
            boxShadow: 2,
          }}
        >
          <Avatar
            src={user?.photoURL}
            alt={user?.displayName || "User"}
            sx={{ bgcolor: "primary.main", width: 40, height: 40 }}
          >
            {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
          </Avatar>
        </IconButton>
      </Box>

      {/* --- MENU DE PERFIL --- */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: { minWidth: 200, borderRadius: 3, mt: 1.5, boxShadow: 4 },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box px={2} py={1.5}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName || "Usuário"}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            display="block"
          >
            {user?.email}
          </Typography>
        </Box>
        <Divider />

        <MenuItem
          onClick={() => {
            navigate("/");
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <Home fontSize="small" />
          </ListItemIcon>{" "}
          Início
        </MenuItem>

        <MenuItem
          onClick={() => {
            navigate("/settings");
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>{" "}
          Configurações
        </MenuItem>

        {isAdmin && (
          <MenuItem
            onClick={() => {
              navigate("/admin");
              handleCloseMenu();
            }}
            sx={{ color: "warning.main" }}
          >
            <ListItemIcon>
              <AdminPanelSettings fontSize="small" color="warning" />
            </ListItemIcon>{" "}
            Painel Admin
          </MenuItem>
        )}

        <Divider />
        <MenuItem onClick={logout} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>{" "}
          Sair
        </MenuItem>
      </Menu>

      {/* --- MENU DE NOTIFICAÇÕES --- */}
      <Popover
        open={Boolean(anchorNotif)}
        anchorEl={anchorNotif}
        onClose={handleCloseNotif}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 320, borderRadius: 3, mt: 1 } }}
      >
        <Box p={2} borderBottom="1px solid" borderColor="divider">
          <Typography variant="subtitle2" fontWeight="bold">
            Avisos do Sistema
          </Typography>
        </Box>
        <List sx={{ maxHeight: 300, overflow: "auto", p: 0 }}>
          {notifications.length === 0 ? (
            <Box p={3} textAlign="center">
              <Typography variant="caption" color="text.secondary">
                Nada de novo por aqui.
              </Typography>
            </Box>
          ) : (
            notifications.map((note) => (
              <ListItem key={note.id} divider alignItems="flex-start">
                <ListIconItem sx={{ minWidth: 32, mt: 0.5 }}>
                  {getNoteIcon(note.type)}
                </ListIconItem>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2">{note.title}</Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        sx={{ display: "block", my: 0.5 }}
                      >
                        {note.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </Box>
  );
}
