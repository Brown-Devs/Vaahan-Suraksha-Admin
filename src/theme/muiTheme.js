// src/theme/muiTheme.js
import { createTheme } from "@mui/material/styles";

const createAppTheme = (mode = "light") =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            primary: { main: "#000000" },
            background: { default: "#ffffff", paper: "#ffffff" },
            text: { primary: "#171717" },
            sidebarHighlight: {main: "#e8e8e8"}
          }
        : {
            primary: { main: "#ffffff" },
            background: { default: "#0a0a0a", paper: "#0f1724" },
            text: { primary: "#ededed" },
            sidebarHighlight: {main: "#e8e8e8"}
          }),
    },
    typography: {
      fontFamily: "var(--font-sans), Inter, sans-serif",
    },
  });

export default createAppTheme;
