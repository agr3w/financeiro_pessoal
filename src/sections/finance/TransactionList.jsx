import React, { useContext, useState, useMemo } from 'react';
import {
  Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography,
  Box, TextField, InputAdornment, Button, Divider, IconButton, Collapse
} from '@mui/material';
import {
  Fastfood, ShoppingBag, LocalGasStation, Bolt, Star, Search,
  ExpandMore, KeyboardArrowDown, CalendarMonth
} from '@mui/icons-material';
import { FinanceContext } from '../../context/FinanceContext';
import { useTheme, alpha } from '@mui/material/styles';

// --- HELPERS ---

const getIconData = (category, theme) => {
  const map = {
    'Alimentação': { icon: <Fastfood />, color: theme.palette.custom.orange, text: theme.palette.custom.orangeText },
    'Transporte': { icon: <LocalGasStation />, color: theme.palette.custom.blue, text: theme.palette.custom.blueText },
    'Compras': { icon: <ShoppingBag />, color: theme.palette.custom.purple, text: theme.palette.custom.purpleText },
    'Contas': { icon: <Bolt />, color: theme.palette.custom.pink, text: theme.palette.custom.pinkText },
  };
  return map[category] || {
    icon: <Star />,
    color: theme.palette.custom.green,
    text: theme.palette.custom.greenText
  };
};

const getDateLabel = (dateObj) => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  if (isSameDay(dateObj, today)) return "Hoje";
  if (isSameDay(dateObj, yesterday)) return "Ontem";

  return dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }); // Ex: 15 de janeiro
};

export default function TransactionList() {
  const { transactions } = useContext(FinanceContext);
  const theme = useTheme();

  // --- ESTADOS LOCAIS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(5); // Começa mostrando apenas 5

  // --- LÓGICA DE FILTRO E AGRUPAMENTO ---

  const processedData = useMemo(() => {
    // 1. Filtrar pela busca
    const filtered = transactions.filter(t =>
      t.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Paginação (Corte)
    const visible = filtered.slice(0, limit);
    const hasMore = filtered.length > limit;

    // 3. Agrupamento por Data
    const groups = visible.reduce((acc, item) => {
      const dateKey = getDateLabel(new Date(item.date));
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});

    return { groups, hasMore, totalFiltered: filtered.length };
  }, [transactions, searchTerm, limit]);

  const handleLoadMore = () => {
    setLimit(prev => prev + 5);
  };

  // --- RENDER ---

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%' // Para ocupar altura do grid
      }}
    >
      {/* CABEÇALHO COM BUSCA */}
      <Box p={2} borderBottom={`1px solid ${theme.palette.divider}`}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar transação..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setLimit(5); // Reseta paginação ao buscar
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, bgcolor: theme.palette.background.default }
          }}
        />
      </Box>

      {/* LISTA VAZIA */}
      {processedData.totalFiltered === 0 && (
        <Box p={4} textAlign="center" color="text.secondary">
          <Typography variant="body2">Nenhuma transação encontrada.</Typography>
        </Box>
      )}

      {/* LISTA AGRUPADA */}
      <List sx={{ overflow: 'auto', flexGrow: 1, px: 1 }}>
        {Object.entries(processedData.groups).map(([dateLabel, items]) => (
          <Box key={dateLabel} mb={1}>
            {/* Título do Grupo (Data) */}
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="bold"
              sx={{
                display: 'block',
                px: 2,
                py: 1,
                textTransform: 'uppercase',
                letterSpacing: 1,
                fontSize: '0.7rem'
              }}
            >
              {dateLabel}
            </Typography>

            {/* Itens do Dia */}
            {items.map((item) => {
              const style = getIconData(item.category, theme);
              const isExpense = item.type === 'expense';

              return (
                <ListItem
                  key={item.id}
                  sx={{
                    borderRadius: 3,
                    mb: 1,
                    py: 1.5,
                    transition: 'background 0.2s',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.04) }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{
                      bgcolor: style.color,
                      color: style.text,
                      width: 40, height: 40,
                      fontSize: '1.2rem'
                    }}>
                      {style.icon}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="bold">{item.label}</Typography>}
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {item.category} • {new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    }
                  />

                  <Box textAlign="right">
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{ color: isExpense ? 'text.primary' : 'success.main' }}
                    >
                      {isExpense ? '-' : '+'} R$ {Math.abs(item.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                </ListItem>
              )
            })}
          </Box>
        ))}
      </List>

      {/* BOTÃO VER MAIS (FOOTER DA LISTA) */}
      {processedData.hasMore && (
        <Box p={2} pt={0}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={handleLoadMore}
            startIcon={<KeyboardArrowDown />}
            sx={{
              borderRadius: 3,
              borderColor: theme.palette.divider,
              color: 'text.secondary',
              '&:hover': { borderColor: theme.palette.primary.main, color: theme.palette.primary.main }
            }}
          >
            Ver mais transações
          </Button>
        </Box>
      )}
    </Paper>
  );
}