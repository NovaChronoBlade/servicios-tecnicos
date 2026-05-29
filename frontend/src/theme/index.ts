import { createTheme, type PaletteOptions, type ThemeOptions } from "@mui/material/styles";
import { lightPalette, darkPalette } from "./palettes";

export type Mode = "light" | "dark";

export function getTheme(mode: Mode) {
  const palette: PaletteOptions = {
    ...(mode === "light" ? lightPalette : darkPalette),
    mode,
  };

  const options: ThemeOptions = {
    palette,
    typography: {
      fontFamily: ['Inter', 'Helvetica', 'Arial', 'sans-serif'].join(","),
      button: {
        textTransform: "none",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          },
          body: {
            backgroundColor: palette.background?.default,
            color: palette.text?.primary,
          },
        },
      },
    },
  };

  return createTheme(options);
}

export const lightTheme = getTheme("light");
export const darkTheme = getTheme("dark");

export default getTheme;
