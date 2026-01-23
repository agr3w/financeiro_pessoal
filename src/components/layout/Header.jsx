import React, { useState, useContext, useEffect } from 'react';
import {
  Box, Avatar, Typography, IconButton, Menu, MenuItem,
  ListItemIcon, Divider, Container, Badge, Popover, List, ListItem, 
  Collapse, Button, useTheme
} from '@mui/material';
import {
  NotificationsNone, Settings, Logout, Person,
  KeyboardArrowDown, Category, Info, Warning, NewReleases, ExpandMore, ExpandLess,
  AdminPanelSettings // <--- Ícone Novo
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { FinanceContext } from '../../context/FinanceContext';
import { useNavigate } from 'react-router-dom';

// Sub-componente para item de notificação com "Ler Mais"
const NotificationItem = ({ note }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 80;
  const isLong = note.message.length > LIMIT;
  const isUpdate = note.type === 'update'; 

  const getIcon = (type) => {
    if (type === 'warning') return <Warning fontSize="small" color="warning" />;
    if (type === 'update') return <NewReleases fontSize="small" color="secondary" />;
    return <Info fontSize="small" color="info" />;
  };

  const bgColor = theme.palette.mode === 'light' ? 
    (note.type === 'warning' ? '#fff4e5' : note.type === 'update' ? '#f3e5f5' : '#fff') 
    : 'background.paper';

  return (
    <ListItem 
      divider 
      alignItems="flex-start" 
      sx={{ 
        bgcolor: bgColor, 
        transition: '0.2s',
        '&:hover': { bgcolor: 'action.hover' } 
      }}
    >
      <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
        {getIcon(note.type)}
      </ListItemIcon>
      <Box width="100%">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography variant="subtitle2" fontWeight="bold">
            {note.title}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
            {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}
          </Typography>
        </Box>
        
        <Box>
           <Typography 
             variant="body2" 
             color="text.secondary" 
             sx={{ 
               wordBreak: 'break-word', 
               whiteSpace: 'pre-wrap',
               display: 'block' 
             }}
           >
             {expanded ? note.message : `${note.message.substring(0, LIMIT)}${isLong ? '...' : ''}`}
           </Typography>
           
           {isLong && (
             <Button 
               size="small" 
               onClick={() => setExpanded(!expanded)}
               sx={{ p: 0, minWidth: 0, textTransform: 'none', mt: 0.5, fontSize: '0.75rem' }}
               endIcon={expanded ? <ExpandLess sx={{width: 14}}/> : <ExpandMore sx={{width: 14}}/>}
             >
               {expanded ? 'Ler menos' : 'Ler mais'}
             </Button>
           )}
        </Box>
      </Box>
    </ListItem>
  );
};

export default function Header({ title, subtitle }) {
  const { user, logout, isAdmin } = useAuth(); // <--- Pegamos o isAdmin do contexto
  const { notifications } = useContext(FinanceContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [anchorNotif, setAnchorNotif] = useState(null);
  
  // Estado para controlar a visibilidade do badge
  const [unreadCount, setUnreadCount] = useState(0);

  // Efeito para calcular notificações não lidas baseado no localStorage
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const lastSeenCount = parseInt(localStorage.getItem('lastSeenNotifCount') || '0');
      // Se tivermos mais notificações do que a última vez que vimos
      if (notifications.length > lastSeenCount) {
        setUnreadCount(notifications.length - lastSeenCount);
      } else {
        setUnreadCount(0);
      }
    }
  }, [notifications]);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  
  const handleOpenNotif = (event) => {
    setAnchorNotif(event.currentTarget);
    
    // Ao abrir, marcamos como tudo lido
    setUnreadCount(0);
    // Salvamos a contagem atual no storage para futuras visitas
    localStorage.setItem('lastSeenNotifCount', notifications.length.toString());
  };
  
  const handleCloseNotif = () => setAnchorNotif(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleGoToSettings = () => {
    navigate('/settings');
    handleCloseMenu();
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', py: 2, borderBottom: 1, borderColor: 'custom.border', mb: 4 }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          
          <Box>
            {title ? (
              <>
                <Typography variant="h5" fontFamily="serif" fontWeight="bold">{title}</Typography>
                {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
              </>
            ) : (
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

          <Box display="flex" alignItems="center" gap={1}>
            
            {/* O badge agora usa o unreadCount controlado localmente */}
            <IconButton onClick={handleOpenNotif} sx={{ border: '1px solid #eee' }}>
              <Badge badgeContent={unreadCount} color="error" invisible={unreadCount === 0}>
                <NotificationsNone color="action" />
              </Badge>
            </IconButton>

            {/* POPOVER ESTILIZADO */}
            <Popover
              open={Boolean(anchorNotif)}
              anchorEl={anchorNotif}
              onClose={handleCloseNotif}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{ sx: { width: 360, borderRadius: 3, mt: 1, boxShadow: 6, overflow: 'hidden' } }}
            >
              <Box p={2} borderBottom="1px solid #eee" bgcolor="background.default">
                  <Typography variant="subtitle2" fontWeight="bold">Avisos do Sistema</Typography>
              </Box>
              
              {/* LISTA COM SCROLLBAR CUSTOMIZADA */}
              <List sx={{ 
                maxHeight: 400, 
                overflowY: 'auto', 
                p: 0,
                // CSS Custom Scrollbar
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': {  background: 'transparent' },
                '&::-webkit-scrollbar-thumb': { 
                    background: '#bdbdbd', 
                    borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb:hover': { background: '#9e9e9e' }
              }}>
                 {notifications?.length === 0 ? (
                     <Box p={4} textAlign="center">
                         <Typography variant="body2" color="text.secondary">Nenhuma notificação recente.</Typography>
                     </Box>
                 ) : (
                     notifications?.map(note => (
                         <NotificationItem key={note.id} note={note} />
                     ))
                 )} 
              </List>
            </Popover>

            {/* User Dropdown */}
            <Box onClick={handleOpenMenu} sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', p: 0.5, pl: 1.5, pr: 1, borderRadius: 50, border: '1px solid #eee', '&:hover': { bgcolor: '#f9f9f9' } }}>
              <Settings fontSize="small" color="action" />
              <KeyboardArrowDown fontSize="small" color="disabled" />
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  mt: 1.5,
                  borderRadius: 0.5,
                  minWidth: 200,
                  '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0 },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => { navigate('/'); handleCloseMenu(); }}>
                <ListItemIcon><Person fontSize="small" /></ListItemIcon>Inicio
              </MenuItem>
              <MenuItem onClick={handleGoToSettings}>
                <ListItemIcon><Settings fontSize="small" /></ListItemIcon>Configurações
              </MenuItem>

               {/* ITEM SECRETO DE ADMIN - SÓ APARECE SE FOR ADMIN */}
              {isAdmin && (
                <MenuItem onClick={() => { navigate('/admin'); handleCloseMenu(); }} sx={{ color: 'warning.main' }}>
                  <ListItemIcon>
                    <AdminPanelSettings fontSize="small" color="warning" />
                  </ListItemIcon>
                  Painel Admin
                </MenuItem>
              )}

              <MenuItem onClick={() => { navigate('/categories'); handleCloseMenu(); }}>
                <ListItemIcon><Category fontSize="small" /></ListItemIcon>Categorias
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>Sair
              </MenuItem>
            </Menu>

          </Box>
        </Box>
      </Container>
    </Box>
  );
}