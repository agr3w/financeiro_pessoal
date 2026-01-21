import React, { useContext } from 'react';
import { Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box } from '@mui/material';
import { Fastfood, ShoppingBag, LocalGasStation, Bolt, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { FinanceContext } from '../../context/FinanceContext';
import { useTheme } from '@mui/material/styles';

const getIconData = (category, theme) => {
  // Mapeamento simples de ícones e cores do nosso tema
  const map = {
    'Alimentação': { icon: <Fastfood />, color: theme.palette.custom.orange, text: theme.palette.custom.orangeText },
    'Transporte': { icon: <LocalGasStation />, color: theme.palette.custom.purple, text: theme.palette.custom.purpleText },
    'Compras': { icon: <ShoppingBag />, color: theme.palette.custom.pink, text: theme.palette.custom.pinkText },
    'Contas': { icon: <Bolt />, color: theme.palette.custom.green, text: theme.palette.custom.greenText },
  };
  return map[category] || { icon: <ShoppingBag />, color: '#eee', text: '#555' };
};

export default function TransactionList() {
  const { transactions } = useContext(FinanceContext);
  const theme = useTheme();

  return (
    <Paper sx={{ p: 0, bgcolor: 'transparent', border: 'none', boxShadow: 'none' }}>
      <List sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {transactions.map((item) => {
          const style = getIconData(item.category, theme);
          const isExpense = item.type === 'expense';

          return (
            <ListItem 
              key={item.id} 
              sx={{ 
                bgcolor: 'background.paper', // Branco
                borderRadius: 2, 
                py: 2,
                boxShadow: '0px 2px 8px rgba(0,0,0,0.02)' // Sombra ultra leve
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: style.color, color: style.text, borderRadius: 3 }}>
                  {style.icon}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={<Typography variant="subtitle1" fontWeight="bold">{item.label}</Typography>}
                secondary={new Date(item.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})}
              />
              
              <Box textAlign="right">
                <Typography 
                  variant="body1" 
                  fontWeight="bold"
                  sx={{ color: isExpense ? 'error.main' : 'success.main', display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  {isExpense ? '-' : '+'} R$ {Math.abs(item.amount).toFixed(2)}
                </Typography>
              </Box>
            </ListItem>
          )
        })}
      </List>
    </Paper>
  );
}