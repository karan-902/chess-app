import { createTheme } from "@mui/material";
import {
    colorBg,
    colorSurface,
    colorBorder,
    colorText,
    colorMuted,
    colorGold,
    colorGoldContrast,
} from "@/constants/colors";

export const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: colorGold,
            contrastText: colorGoldContrast,
        },
        background: {
            default: colorBg,
            paper: colorSurface,
        },
        text: {
            primary: colorText,
            secondary: colorMuted,
        },
        divider: colorBorder,
    },

    typography: {
        fontFamily: "Outfit-Regular",
    },

    components: {
        MuiTypography: {
            styleOverrides: {
                root: {
                    fontFamily: "Outfit-Regular",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: "Outfit-SemiBold",
                    textTransform: "none",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
    },
});
