import React, {useContext} from 'react';
import { 
  Card, CardHeader, CardContent, List, ListItem, 
  ListItemAvatar, Avatar, ListItemText, Typography, Divider, Box 
} from '@mui/material';
import { Fastfood, ShoppingBag, LocalGasStation, Work, Payment } from '@mui/icons-material';
import { FinanceContext } from '../../context/FinanceContext';

// Dados falsos só para visualizar a estrutura
const MOCK_TRANSACTIONS = [
  { id: 1, label: 'Mercado Semanal', amount: -450.00, date: 'Hoje, 10:30', category: 'food' },
  { id: 2, label: 'Freela Design', amount: 1200.00, date: 'Ontem, 14:00', category: 'income' },
  { id: 3, label: 'Gasolina', amount: -200.00, date: '18/01', category: 'transport' },
];

const getIcon = (category) => {
  switch(category) {
    case 'food': return <Fastfood />;
    case 'transport': return <LocalGasStation />;
    case 'income': return <Work />;
    default: return <ShoppingBag />;
  }
};

export default function TransactionList() {
  const { transactions } = useContext(FinanceContext);

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardHeader title="Últimas Movimentações" />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        <List>
          {transactions.map((item, index) => (
            <React.Fragment key={item.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ 
                    bgcolor: item.amount > 0 ? '#e8f5e9' : '#ffebee', 
                    color: item.amount > 0 ? '#2e7d32' : '#c62828' 
                  }}>
                    {getIcon(item.category)}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={item.label}
                  secondary={item.date instanceof Date ? item.date.toLocaleDateString('pt-BR') : item.date}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
                
                <Typography 
                  variant="body1" 
                  fontWeight="bold"
                  color={item.amount > 0 ? 'success.main' : 'error.main'}
                  sx={{ alignSelf: 'center' }}
                >
                  {item.amount > 0 ? '+' : ''} R$ {Math.abs(item.amount).toFixed(2)}
                </Typography>
              </ListItem>
              {index < transactions.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}