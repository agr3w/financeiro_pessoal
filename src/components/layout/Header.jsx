import React, { useState, useContext } from 'react';
import { 
  Box, Typography, Avatar, IconButton, Menu, MenuItem, 
  ListItemIcon, Divider, Badge, Popover, List, ListItem, 
  ListItemText, ListItemIcon as ListIconItem, Paper, Button, useMediaQuery 
} from '@mui/material';
import { 
  Logout, Settings, NotificationsNone, Info, Warning, 
  NewReleases, AdminPanelSettings, Home, Dashboard as DashboardIcon, Category 
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';
import { FinanceContext } from '../../context/FinanceContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ title, subtitle }) {
  const { user, logout, isAdmin } = useAuth();
  const { notifications } = useContext(FinanceContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // Verifica se é tela grande (Desktop/Tablet)
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorNotif, setAnchorNotif] = useState(null);
  
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleOpenNotif = (event) => setAnchorNotif(event.currentTarget);
  const handleCloseNotif = () => setAnchorNotif(null);

  const getNoteIcon = (type) => {
    if (type === 'warning') return <Warning fontSize="small" color="warning" />;
    if (type === 'update') return <NewReleases fontSize="small" color="secondary" />;
    return <Info fontSize="small" color="info" />;
  };

  // Itens de Navegação
  const navItems = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Categorias', path: '/categories', icon: <Category fontSize="small" /> },
    ...(isAdmin ? [{ label: 'Admin', path: '/admin', icon: <AdminPanelSettings fontSize="small" />, color: 'warning.main' }] : []),
    { label: 'Ajustes', path: '/settings', icon: <Settings fontSize="small" /> },
  ];

  return (
    <Paper 
      elevation={0}
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4, 
        p: 2, 
        px: 3,
        borderRadius: 0, 
      }}
    >
      {/* 1. TÍTULO / LOGO */}
      <Box 
        onClick={() => navigate('/')} 
        sx={{ 
            cursor: 'pointer', 
            minWidth: 200, // Garante espaço fixo à esquerda para centralizar o menu
            '&:hover': { opacity: 0.7 },
            transition: 'opacity 0.2s'
        }}
      >
        <Typography variant="h6" component="h1" fontWeight="bold" sx={{ letterSpacing: '-0.5px', lineHeight: 1.2 }}>
          {title}
        </Typography>
        {subtitle && !isDesktop && ( // Esconde subtítulo em desktop se quiser economizar espaço
            <Typography variant="caption" color="text.secondary">
            {subtitle}
            </Typography>
        )}
      </Box>

      {/* 2. NAVEGAÇÃO CENTRAL (SÓ DESKTOP) */}
      {isDesktop && (
        <Box 
            sx={{ 
                display: 'flex', 
                gap: 1, 
                bgcolor: alpha(theme.palette.text.primary, 0.04), // Fundo sutil para o grupo
                p: 0.5, 
                borderRadius: 3 
            }}
        >
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        startIcon={item.icon}
                        sx={{
                            color: isActive ? (item.color || 'primary.main') : 'text.secondary',
                            bgcolor: isActive ? 'background.paper' : 'transparent',
                            boxShadow: isActive ? theme.shadows[1] : 'none',
                            fontWeight: isActive ? 700 : 500,
                            borderRadius: 2.5,
                            px: 2,
                            textTransform: 'none',
                            '&:hover': { 
                                bgcolor: isActive ? 'background.paper' : alpha(theme.palette.text.primary, 0.05),
                                color: item.color || 'text.primary'
                            }
                        }}
                    >
                        {item.label}
                    </Button>
                )
            })}
        </Box>
      )}

      {/* 3. AÇÕES (DIREITA) */}
      <Box display="flex" gap={1.5} alignItems="center" justifyContent="flex-end" sx={{ minWidth: 200 }}>
        
        {/* Notificações */}
        <IconButton onClick={handleOpenNotif} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <Badge badgeContent={notifications.length} color="error">
            <NotificationsNone color="action" />
            </Badge>
        </IconButton>

        {/* Menu de Perfil (Avatar) */}
        <IconButton onClick={handleOpenMenu} sx={{ p: 0, border: '2px solid', borderColor: 'background.paper', boxShadow: 2 }}>
          <Avatar 
            src={user?.photoURL} 
            sx={{ bgcolor: 'primary.main', width: 40, height: 40, fontSize: '1rem' }}
          >
            {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
          </Avatar>
        </IconButton>
      </Box>

      {/* --- MENUS --- */}
      
      {/* Menu Principal (Inclui navegação no Mobile) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{ sx: { minWidth: 220, borderRadius: 1.5, mt: 1.5 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box px={2} py={1.5}>
          <Typography variant="subtitle2" noWrap>{user?.displayName || 'Usuário'}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap display="block">{user?.email}</Typography>
        </Box>
        <Divider />
        
        {/* Renderiza itens de navegação no menu SOMENTE SE FOR MOBILE */}
        {!isDesktop && navItems.map((item) => (
            <MenuItem key={item.path} onClick={() => { navigate(item.path); handleCloseMenu(); }} sx={{ color: item.color }}>
                <ListItemIcon sx={{ color: item.color || 'inherit' }}>{item.icon}</ListItemIcon> 
                {item.label}
            </MenuItem>
        ))}
        {!isDesktop && <Divider />}

        <MenuItem onClick={logout} sx={{ color: 'error.main' }}>
            <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon> 
            Sair
        </MenuItem>
      </Menu>

      {/* Popover de Notificações (Igual) */}
      <Popover
        open={Boolean(anchorNotif)}
        anchorEl={anchorNotif}
        onClose={handleCloseNotif}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 320, borderRadius: 1.5, mt: 1 } }}
      >
        <Box p={2} borderBottom="1px solid" borderColor="divider"><Typography variant="subtitle2" fontWeight="bold">Avisos</Typography></Box>
        <List sx={{ maxHeight: 300, overflow: 'auto', p: 0 }}>
            {notifications.length === 0 ? <Box p={3} textAlign="center"><Typography variant="caption" color="text.secondary">Nada novo.</Typography></Box> : 
                notifications.map(note => (
                    <ListItem key={note.id} divider alignItems="flex-start">
                        <ListIconItem sx={{ minWidth: 32, mt: 0.5 }}>{getNoteIcon(note.type)}</ListIconItem>
                        <ListItemText primary={<Typography variant="subtitle2">{note.title}</Typography>} secondary={note.message} />
                    </ListItem>
                ))
            }
        </List>
      </Popover>
    </Paper>
  );
}