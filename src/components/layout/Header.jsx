import React, { useState } from 'react';
import {
  Box, Avatar, Typography, IconButton, Menu, MenuItem,
  ListItemIcon, Divider, Container
} from '@mui/material';
import {
  NotificationsNone, Settings, Logout, Person,
  KeyboardArrowDown, Category
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header({ title, subtitle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estado para controlar o menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleGoToSettings = () => {
    navigate('/settings');
    handleCloseMenu();
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', py: 2, borderBottom: '1px solid rgba(0,0,0,0.05)', mb: 4 }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center">

          {/* Lado Esquerdo: Título Dinâmico */}
          <Box>
            {title ? (
              <>
                <Typography variant="h5" fontFamily="serif" fontWeight="bold">{title}</Typography>
                {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
              </>
            ) : (
              // Default (Dashboard)
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontSize: '1.2rem' }}>
                  {user?.email?.[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Bem-vindo de volta,</Typography>
                  <Typography variant="h6" fontFamily="serif" lineHeight={1}>
                    {user?.email?.split('@')[0]}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Lado Direito: Ações */}
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton sx={{ border: '1px solid #eee' }}>
              <NotificationsNone color="action" />
            </IconButton>

            {/* Botão de Perfil com Menu */}
            <Box
              onClick={handleOpenMenu}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                p: 0.5,
                pl: 1.5,
                pr: 1,
                borderRadius: 50,
                border: '1px solid #eee',
                '&:hover': { bgcolor: '#f9f9f9' }
              }}
            >
              <Settings fontSize="small" color="action" />
              <KeyboardArrowDown fontSize="small" color="disabled" />
            </Box>

            {/* O Menu Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              onClick={handleCloseMenu}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  borderRadius: 3,
                  minWidth: 200,
                  '&:before': { // A setinha apontando pra cima
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => { navigate('/'); handleCloseMenu(); }}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                Inicio
              </MenuItem>
              <MenuItem onClick={handleGoToSettings}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Configurações
              </MenuItem>
              <MenuItem onClick={() => { navigate('/categories'); handleCloseMenu(); }}>
                <ListItemIcon>
                  <Category fontSize="small" />
                </ListItemIcon>
                Categorias
              </MenuItem>

              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                Sair
              </MenuItem>
            </Menu>

          </Box>
        </Box>
      </Container>
    </Box>
  );
}