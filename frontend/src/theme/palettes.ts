import type { PaletteOptions } from "@mui/material/styles";

export const lightPalette: PaletteOptions = {
    mode: "light",
    primary: {
        main: "#006A63",
        contrastText: "#FFFFFF",
    },
    secondary: {
        main: "#4A6360",
        contrastText: "#FFFFFF",
    },
    background: {
        default: "#F4FBF8",
        paper: "#FFFFFF",
    },
    text: {
        primary: "#161D1C",
        secondary: "#3F4947",
    },
    error: {
        main: "#BA1A1A",
    },
};

export const darkPalette: PaletteOptions = {
    mode: "dark",
    primary: {
        main: "#81D5CB",
        contrastText: "#003733",
    },
    secondary: {
        main: "#B1CCC8",
        contrastText: "#1C3532",
    },
    background: {
        default: "#0E1514",
        paper: "#0E1514",
    },
    text: {
        primary: "#DDE4E2",
        secondary: "#BEC9C6",
    },
    error: {
        main: "#FFB4AB",
    },
};