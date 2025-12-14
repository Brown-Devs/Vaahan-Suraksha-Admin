"use client";
import React, { useEffect, useMemo, useState } from "react";
import { ThemeProvider, CssBaseline, Button } from "@mui/material";
import createAppTheme from "@/theme/muiTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const THEME_KEY = "vs_theme_mode"; // "light" | "dark"

export default function MainLayoutProvider({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  // default to system if nothing in storage
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "light";
    try {
      return localStorage.getItem(THEME_KEY) || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    } catch {
      return "light";
    }
  });

  // apply .dark class to html element, and persist
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    try { localStorage.setItem(THEME_KEY, mode); } catch {}
  }, [mode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  // a tiny UI helper — you can remove or place elsewhere
  const ToggleButton = () => (
    <Button
      size="small"
      onClick={() => setMode(prev => prev === "dark" ? "light" : "dark")}
      sx={{ position: "fixed", right: 16, bottom: 16, zIndex: 9999 }}
      variant="contained"
    >
      {mode === "dark" ? "Switch to Light" : "Switch to Dark"}
    </Button>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <ToggleButton />
      </ThemeProvider>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}


// "use client"
// import { CssBaseline, ThemeProvider } from "@mui/material"
// import theme from "@/theme/muiTheme"
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useState } from "react";
// import { Toaster } from "react-hot-toast";

// function MainLayoutProvider({ children }) {
//     const [queryClient] = useState(
//         () =>
//             new QueryClient({
//                 defaultOptions: {
//                     queries: {
//                         staleTime: 60 * 1000,
//                         retry: false,
//                     },
//                 },
//             })
//     );

//     return (
//         <QueryClientProvider client={queryClient}>
//             <ThemeProvider theme={theme}>
//                 <CssBaseline />
//                 {children}
//                 {process.env.NODE_ENV === "development" && (
//                     <ReactQueryDevtools initialIsOpen={false} />
//                 )}
//             </ThemeProvider>
//             <Toaster position="top-right" />
//         </QueryClientProvider>
//     )
// }

// export default MainLayoutProvider