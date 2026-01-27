import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SentimentDissatisfied } from "@mui/icons-material";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        textAlign: "center",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <SentimentDissatisfied
          sx={{ fontSize: 80, color: "text.secondary", mb: 2, opacity: 0.5 }}
        />

        <Typography
          variant="h2"
          fontFamily="serif"
          fontWeight="bold"
          color="primary"
        >
          404
        </Typography>

        <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
          Página não encontrada
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Ops! Parece que você se perdeu no fluxo de caixa. Essa página não
          existe ou foi movida.
        </Typography>

        <Box display="flex" gap={2} justifyContent="center">
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Voltar
          </Button>
          <Button variant="contained" onClick={() => navigate("/")}>
            Ir para o Início
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
