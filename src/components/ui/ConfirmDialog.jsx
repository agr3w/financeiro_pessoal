import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { WarningAmber } from "@mui/icons-material";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Tem certeza?",
  message = "Esta ação não pode ser desfeita.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger", // 'danger' (vermelho) ou 'info' (azul)
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
    >
      <Box textAlign="center" pt={2}>
        {type === "danger" && (
          <WarningAmber
            sx={{ fontSize: 48, color: "error.main", mb: 1, opacity: 0.8 }}
          />
        )}
        <DialogTitle sx={{ p: 0, mb: 1, fontWeight: "bold" }}>
          {title}
        </DialogTitle>
      </Box>

      <DialogContent sx={{ textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 3, textTransform: "none", px: 3 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          color={type === "danger" ? "error" : "primary"}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            px: 3,
            boxShadow: "none",
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
