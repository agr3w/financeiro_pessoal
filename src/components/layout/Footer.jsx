import React from "react";
import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        textAlign: "center",
        opacity: 0.6,
        transition: "opacity 0.3s",
        "&:hover": { opacity: 1 },
      }}
    >
      <Typography variant="body2" color="text.secondary" fontFamily="serif">
        Desenvolvido por <strong>Weslley Luiz Kampa</strong> • v1.0.0
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block">
        © {new Date().getFullYear()} Financeiro Pessoal. Todos os direitos
        reservados.
      </Typography>
    </Box>
  );
}
