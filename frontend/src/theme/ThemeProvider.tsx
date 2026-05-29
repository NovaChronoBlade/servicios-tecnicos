"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import getTheme, { Mode } from "./index";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

export default function ThemeProvider({
  children,
  defaultMode,
}: {
  children: React.ReactNode;
  defaultMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(defaultMode ?? "light");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("theme") as Mode | null;
      if (saved === "light" || saved === "dark") {
        setMode(saved);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("theme", mode);
    } catch (e) {}
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = mode;
    }
  }, [mode]);

  const colorMode = useMemo(
    () => ({ toggleColorMode: () => setMode((prev) => (prev === "light" ? "dark" : "light")) }),
    []
  );

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
