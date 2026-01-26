export const formatCurrency = (value) => {
  const absValue = Math.abs(value);
  const formatted = absValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  // Se for negativo, coloca o sinal ANTES do R$: "- R$ 50,00"
  // O padrão do browser as vezes é "R$ -50,00" (feio)
  return value < 0 ? `- ${formatted}` : formatted;
};

export const capitalizeMonth = (date) => {
  const month = date.toLocaleDateString('pt-BR', { month: 'long' });
  return month.charAt(0).toUpperCase() + month.slice(1);
};