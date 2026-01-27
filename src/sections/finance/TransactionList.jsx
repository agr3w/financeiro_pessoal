import React, { useContext, useState, useMemo } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Fastfood,
  ShoppingBag,
  LocalGasStation,
  Bolt,
  Star,
  Search,
  MoreVert,
  Edit,
  Delete,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { FinanceContext } from "../../context/FinanceContext";
import { useTheme, alpha } from "@mui/material/styles";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

// Helpers
const getIconData = (category, theme) => {
  const map = {
    Alimentação: {
      icon: <Fastfood />,
      color: theme.palette.custom?.orange || "#F97316",
      text: theme.palette.custom?.orangeText || "#C2410C",
    },
    Transporte: {
      icon: <LocalGasStation />,
      color: theme.palette.custom?.blue || "#3B82F6",
      text: theme.palette.custom?.blueText || "#1D4ED8",
    },
    Compras: {
      icon: <ShoppingBag />,
      color: theme.palette.custom?.purple || "#A855F7",
      text: theme.palette.custom?.purpleText || "#7E22CE",
    },
    Contas: {
      icon: <Bolt />,
      color: theme.palette.custom?.pink || "#EC4899",
      text: theme.palette.custom?.pinkText || "#BE185D",
    },
  };
  return (
    map[category] || {
      icon: <Star />,
      color: theme.palette.custom?.green || "#10B981",
      text: theme.palette.custom?.greenText || "#047857",
    }
  );
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

  return dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
};

// Helper para traduzir método de pagamento
const getPaymentLabel = (method) => {
  const map = {
    credit: "Crédito",
    debit: "Débito",
    pix: "Pix",
    cash: "Dinheiro",
    voucher: "Vale",
  };
  return map[method] || null;
};

export default function TransactionList() {
  const {
    transactions,
    removeTransaction: deleteTransaction,
    editTransaction: updateTransaction,
  } = useContext(FinanceContext);

  const theme = useTheme();

  // Estados
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(5);

  // Estados para Menu e Ações
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);

  // Modais
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // Estado do Form de Edição
  const [editForm, setEditForm] = useState({ label: "", amount: "" });

  // --- HANDLERS ---
  const handleOpenMenu = (event, transaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTx(transaction);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    handleCloseMenu();
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    if (selectedTx) {
      await deleteTransaction(selectedTx.id);
      setOpenDelete(false);
      setSelectedTx(null);
    }
  };

  const handleEditClick = () => {
    handleCloseMenu();
    setEditForm({
      label: selectedTx.label,
      amount: String(Math.abs(selectedTx.amount)),
    });
    setOpenEdit(true);
  };

  const saveEdit = async () => {
    if (!selectedTx || !editForm.label || !editForm.amount) return;

    const originalSignal = selectedTx.amount < 0 ? -1 : 1;
    const newAmount = parseFloat(editForm.amount) * originalSignal;

    await updateTransaction(selectedTx.id, {
      label: editForm.label,
      amount: newAmount,
    });

    setOpenEdit(false);
    setSelectedTx(null);
  };

  // --- ORDENAÇÃO E FILTRO ---
  const processedData = useMemo(() => {
    const filtered = (transactions || []).filter(
      (t) =>
        (t.label || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.category || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const visible = filtered.slice(0, limit);
    const hasMore = filtered.length > limit;

    const groups = visible.reduce((acc, item) => {
      const dateKey = getDateLabel(new Date(item.date));
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(item);
      return acc;
    }, {});

    return { groups, hasMore, totalFiltered: filtered.length };
  }, [transactions, searchTerm, limit]);

  const handleLoadMore = () => setLimit((prev) => prev + 5);

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box p={2} borderBottom={`1px solid ${theme.palette.divider}`}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setLimit(5);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, bgcolor: theme.palette.background.default },
          }}
        />
      </Box>

      {processedData.totalFiltered === 0 && (
        <Box p={4} textAlign="center" color="text.secondary">
          <Typography variant="body2">Nenhuma transação encontrada.</Typography>
        </Box>
      )}

      <List sx={{ overflow: "auto", flexGrow: 1, px: 1 }}>
        {Object.entries(processedData.groups).map(([dateLabel, items]) => (
          <Box key={dateLabel} mb={1}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="bold"
              sx={{
                px: 2,
                py: 1,
                display: "block",
                textTransform: "uppercase",
                letterSpacing: 1,
                fontSize: "0.7rem",
              }}
            >
              {dateLabel}
            </Typography>

            {items.map((item) => {
              const style = getIconData(item.category, theme);
              const isExpense = item.type === "expense";
              const paymentLabel = getPaymentLabel(item.paymentMethod);

              return (
                <ListItem
                  key={item.id}
                  sx={{
                    borderRadius: 3,
                    mb: 1,
                    py: 1.5,
                    transition: "background 0.2s",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                  secondaryAction={
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenMenu(e, item)}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: style.color,
                        color: style.text,
                        width: 40,
                        height: 40,
                        fontSize: "1.2rem",
                      }}
                    >
                      {style.icon}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="bold">
                        {item.label}
                      </Typography>
                    }
                    // CORREÇÃO: Define o componente wrapper como 'div' para permitir Box/Div filhos
                    secondaryTypographyProps={{ component: "div" }}
                    secondary={
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        flexWrap="wrap"
                      >
                        <Typography variant="caption" color="text.secondary">
                          {item.category}
                        </Typography>

                        {/* MOSTRAR PAGAMENTO SE EXISTIR */}
                        {paymentLabel && (
                          <>
                            <Typography variant="caption" color="text.disabled">
                              •
                            </Typography>
                            <Box
                              sx={{
                                bgcolor: alpha(
                                  theme.palette.text.primary,
                                  0.05,
                                ),
                                px: 0.8,
                                py: 0.2,
                                borderRadius: 1,
                                display: "inline-flex",
                              }}
                            >
                              <Typography
                                variant="caption"
                                fontWeight="bold"
                                color="text.secondary"
                                sx={{ fontSize: "0.65rem" }}
                              >
                                {paymentLabel.toUpperCase()}
                              </Typography>
                            </Box>
                          </>
                        )}

                        <Typography variant="caption" color="text.disabled">
                          •
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(item.date).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Box>
                    }
                  />

                  <Box textAlign="right" mr={2}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        color: isExpense ? "text.primary" : "success.main",
                      }}
                    >
                      {isExpense ? "-" : "+"}{" "}
                      {Math.abs(item.amount).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </Typography>
                  </Box>
                </ListItem>
              );
            })}
          </Box>
        ))}
      </List>

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
              color: "text.secondary",
              borderColor: theme.palette.divider,
            }}
          >
            Ver mais
          </Button>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: { borderRadius: 2, boxShadow: theme.shadows[3], minWidth: 150 },
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>{" "}
          Editar
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>{" "}
          Excluir
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={confirmDelete}
        title="Excluir Transação?"
        message={`Deseja realmente apagar "${selectedTx?.label}"? O valor será removido do saldo.`}
        confirmText="Sim, excluir"
      />

      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, p: 1 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>Editar Transação</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              label="Descrição"
              fullWidth
              value={editForm.label}
              onChange={(e) =>
                setEditForm({ ...editForm, label: e.target.value })
              }
            />
            <TextField
              label="Valor"
              type="number"
              fullWidth
              value={editForm.amount}
              onChange={(e) =>
                setEditForm({ ...editForm, amount: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenEdit(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={saveEdit}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
