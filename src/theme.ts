import { createTheme } from "@mui/material";
import {
    colorBg,
    colorSurface,
    colorBorder,
    colorText,
    colorMuted,
    colorGold,
    colorGoldContrast,
    colorBgLight,
    colorSurfaceLight,
    colorBorderLight,
    colorTextLight,
    colorMutedLight,
    colorGoldLight,
    colorGoldContrastLight,
} from "@/constants/colors";
import type { ThemeMode } from "@/context/ThemeContext";

export function getMuiTheme(mode: ThemeMode) {
    const isDark = mode === "dark";

    return createTheme({
        palette: {
            mode,
            primary: {
                main: isDark ? colorGold : colorGoldLight,
                contrastText: isDark ? colorGoldContrast : colorGoldContrastLight,
            },
            background: {
                default: isDark ? colorBg : colorBgLight,
                paper: isDark ? colorSurface : colorSurfaceLight,
            },
            text: {
                primary: isDark ? colorText : colorTextLight,
                secondary: isDark ? colorMuted : colorMutedLight,
            },
            divider: isDark ? colorBorder : colorBorderLight,
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
}
