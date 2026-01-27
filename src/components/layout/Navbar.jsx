// src/components/layout/Navbar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "1px solid #eee" }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "#333" }}
        >
          Financeiro Casal
        </Typography>
        <Box
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#007FFF",
            borderRadius: "50%",
          }}
        />{" "}
        {/* Avatar fake */}
      </Toolbar>
    </AppBar>
  );
}
