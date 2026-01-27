import React from "react";
import { Box, Container, Fade } from "@mui/material";
import Header from "./Header";
import BottomMenu from "./BottomMenu";
import { useLocation } from "react-router-dom";

export default function AppLayout({ children, title, subtitle }) {
  const location = useLocation();
  // Se quiser esconder o menu em alguma rota específica (ex: login), pode filtrar aqui
  const showMenu = location.pathname !== "/login";

  return (
    <Box sx={{ minHeight: "100vh", pb: 12 }}>
      {" "}
      {/* Padding bottom para o menu não cortar conteúdo */}
      <Container maxWidth="md" sx={{ px: { xs: 2, md: 3 } }}>
        {/* Header Padrão */}
        <Header title={title} subtitle={subtitle} />

        {/* Conteúdo da Página com Animação Suave */}
        <Fade in={true} timeout={500}>
          <Box>{children}</Box>
        </Fade>
      </Container>
      {/* Menu Flutuante */}
      {showMenu && <BottomMenu />}
    </Box>
  );
}
