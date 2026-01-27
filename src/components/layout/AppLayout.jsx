import React from "react";
import { Box, Container, Fade } from "@mui/material";
import Header from "./Header";
import BottomMenu from "./BottomMenu";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

export default function AppLayout({ children, title, subtitle }) {
  const location = useLocation();
  const showMenu = location.pathname !== "/login";

  return (
    <Box sx={{ minHeight: "100vh", pb: 12 }}>
      <Container maxWidth="md" sx={{ px: { xs: 2, md: 3 } }}>
        <Header title={title} subtitle={subtitle} />

        <Fade in={true} timeout={500}>
          <Box>{children}</Box>
        </Fade>
        {showMenu && <Footer />}
      </Container>

      {showMenu && <BottomMenu />}
    </Box>
  );
}
