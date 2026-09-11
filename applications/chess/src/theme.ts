import { createTheme, alpha } from "@mui/material";
import {
 colorBg,
 colorSurface,
 colorSurfaceRaised,
 colorBorder,
 colorText,
 colorMuted,
 colorPrimary,
 colorPrimaryDark,
 colorPrimaryContrast,
 colorSecondary,
 colorError,
 colorSuccess,
 colorWarning,
 colorBgLight,
 colorSurfaceLight,
 colorSurfaceRaisedLight,
 colorBorderLight,
 colorTextLight,
 colorMutedLight,
 colorPrimaryLight,
 colorPrimaryDarkLight,
 colorPrimaryContrastLight,
 colorSecondaryLight,
 colorErrorLight,
 colorSuccessLight,
 colorWarningLight,
} from "@/constants/colors";
import type { ThemeMode } from "@/context/ThemeContext";

const fontFamily = '"Outfit-Regular", system-ui, sans-serif';

export function getMuiTheme(mode: ThemeMode) {
 const isDark = mode === "dark";

 const primary = isDark ? colorPrimary : colorPrimaryLight;
 const primaryDark = isDark ? colorPrimaryDark : colorPrimaryDarkLight;
 const primaryContrast = isDark
  ? colorPrimaryContrast
  : colorPrimaryContrastLight;
 const surfaceRaised = isDark ? colorSurfaceRaised : colorSurfaceRaisedLight;
 const border = isDark ? colorBorder : colorBorderLight;

 return createTheme({
  palette: {
   mode,
   primary: {
    main: primary,
    dark: primaryDark,
    contrastText: primaryContrast,
   },
   secondary: {
    main: isDark ? colorSecondary : colorSecondaryLight,
    contrastText: isDark ? colorBg : "#ffffff",
   },
   error: { main: isDark ? colorError : colorErrorLight },
   success: { main: isDark ? colorSuccess : colorSuccessLight },
   warning: { main: isDark ? colorWarning : colorWarningLight },
   background: {
    default: isDark ? colorBg : colorBgLight,
    paper: isDark ? colorSurface : colorSurfaceLight,
   },
   text: {
    primary: isDark ? colorText : colorTextLight,
    secondary: isDark ? colorMuted : colorMutedLight,
   },
   divider: border,
  },

  shape: { borderRadius: 5 },

  typography: {
   fontFamily,
   h1: {
    fontFamily: "Outfit-ExtraBold",

    letterSpacing: "-0.04em",
   },
   h2: {
    fontFamily: "Outfit-Bold",
    letterSpacing: "-0.03em",
   },
   h3: {
    fontFamily: "Outfit-Bold",
    letterSpacing: "-0.02em",
   },
   h4: { fontFamily: "Outfit-SemiBold" },
   h5: { fontFamily: "Outfit-SemiBold" },
   h6: { fontFamily: "Outfit-SemiBold" },
   body1: { lineHeight: 1.6 },
   body2: { lineHeight: 1.6 },
   button: {
    fontFamily: "Outfit-SemiBold",
    textTransform: "none",
    letterSpacing: "0.04em",
   },
   overline: {
    fontFamily: "Outfit-Bold",

    fontSize: "0.65rem",
    letterSpacing: "0.22em",
   },
  },

  components: {
   MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
     root: { borderRadius: 5, textTransform: "none" },
    },
   },
   MuiPaper: {
    styleOverrides: { root: { backgroundImage: "none" } },
   },

   MuiMenu: {
    styleOverrides: {
     paper: {
      backgroundColor: isDark ? colorSurface : colorSurfaceLight,
      border: `1px solid ${border}`,
      borderRadius: 8,
     },
    },
   },
   MuiMenuItem: {
    styleOverrides: {
     root: {
      fontFamily,
      fontSize: "0.875rem",
      "&.Mui-selected": {
       backgroundColor: alpha(primary, 0.12),
      },
     },
    },
   },
   MuiSwitch: {
    styleOverrides: {
     track: {
      backgroundColor: alpha(isDark ? colorText : colorTextLight, 0.3),
     },
    },
   },
   MuiOutlinedInput: {
    styleOverrides: {
     root: {
      borderRadius: 10,
      backgroundColor: surfaceRaised,
     },
     notchedOutline: { borderColor: border },
    },
   },
  },
 });
}
