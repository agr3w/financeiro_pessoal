import React from "react";
import { Box, Typography, IconButton, Divider, Stack } from "@mui/material";
import { LinkedIn, Code, Instagram } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export default function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <Code fontSize="small" />,
      url: "https://weslleykampa.netlify.app/",
      label: "Site do Weslley",
    }, 
    {
      icon: <LinkedIn fontSize="small" />,
      url: "https://www.linkedin.com/in/weslley-luiz-kampa/",
      label: "LinkedIn",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        textAlign: "center",
        transition: "opacity 0.3s",
        "&:hover": { opacity: 1 },
        p: 3,
      }}
    >
      <Divider
        sx={{
          mb: 3,
          mx: "auto",
          width: "10%",
          borderColor: theme.palette.divider,
        }}
      />

      {/* 1. Logo / Nome do App */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={1}
        mb={1}
      >
        <Code fontSize="small" color="primary" />
        <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
          Finance Pessoal
        </Typography>
      </Box>

      {/* 2. Créditos */}
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Desenvolvido com 💙 por <strong>Weslley Kampa</strong>
      </Typography>

      {/* 3. Ícones Sociais (Essencial para Portfólio) */}
      <Stack direction="row" spacing={1} justifyContent="center" mb={2}>
        {socialLinks.map((link) => (
          <IconButton
            key={link.label}
            component="a"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{
              color: "text.disabled",
              border: `1px solid ${theme.palette.divider}`,
              "&:hover": {
                color: "primary.main",
                borderColor: "primary.main",
                bgcolor: "action.hover",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s",
            }}
          >
            {link.icon}
          </IconButton>
        ))}
      </Stack>

      {/* 4. Copyright e Versão */}
      <Typography variant="caption" display="block" color="text.disabled">
        © {currentYear} • v1.0.0 (Beta)
      </Typography>
    </Box>
  );
}
