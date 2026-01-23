import React, { useContext } from 'react';
import { Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box } from '@mui/material';
import { Fastfood, ShoppingBag, LocalGasStation, Bolt, Star } from '@mui/icons-material';
import { FinanceContext } from '../../context/FinanceContext';
import { useTheme, alpha } from '@mui/material/styles';

const getIconData = (category, theme) => {
  // Mapeia para as cores do tema 'custom'
  const map = {
    'Alimentação': { icon: <Fastfood />, color: theme.palette.custom.orange, text: theme.palette.custom.orangeText },
    'Transporte': { icon: <LocalGasStation />, color: theme.palette.custom.blue, text: theme.palette.custom.blueText },
    'Compras': { icon: <ShoppingBag />, color: theme.palette.custom.purple, text: theme.palette.custom.purpleText },
    'Contas': { icon: <Bolt />, color: theme.palette.custom.pink, text: theme.palette.custom.pinkText },
  };
  // Fallback genérico (Verde)
  return map[category] || { 
      icon: <Star />, 
      color: theme.palette.custom.green, 
      text: theme.palette.custom.greenText 
  };
};

export default function TransactionList() {
  const { transactions } = useContext(FinanceContext);
  const theme = useTheme();

  if (transactions.length === 0) {
      return (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', color: 'text.secondary', borderStyle: 'dashed', border: '1px solid' }}>
              <Typography>Nenhuma movimentação neste mês.</Typography>
          </Paper>
      )
  }

  return (
    <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
      <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {transactions.map((item) => {
          const style = getIconData(item.category, theme);
          const isExpense = item.type === 'expense';

          return (
            <ListItem 
              key={item.id} 
              sx={{ 
                bgcolor: 'background.paper',
                borderRadius: 3, 
                py: 2,
                border: `1px solid ${theme.palette.divider}`,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.01)', borderColor: theme.palette.primary.main }
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ 
                    bgcolor: style.color, 
                    color: style.text, 
                    borderRadius: 3,
                    width: 48, height: 48
                }}>
                  {style.icon}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={<Typography variant="body1" fontWeight="bold">{item.label}</Typography>}
                secondary={new Date(item.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'})}
              />
              
              <Box textAlign="right">
                <Typography 
                  variant="body1" 
                  fontWeight="bold"
                  sx={{ color: isExpense ? 'text.primary' : 'success.main' }}
                >
                  {isExpense ? '-' : '+'} R$ {Math.abs(item.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 700 }}>
                    {item.category}
                </Typography>
              </Box>
            </ListItem>
          )
        })}
      </List>
    </Paper>
  );
}