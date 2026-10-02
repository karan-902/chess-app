import { createTheme, alpha } from "@mui/material";
import {
 COLOR_BG,
 COLOR_SURFACE,
 COLOR_SURFACE_RAISED,
 COLOR_BORDER,
 COLOR_TEXT,
 COLOR_MUTED,
 COLOR_PRIMARY,
 COLOR_PRIMARY_DARK,
 COLOR_PRIMARY_CONTRAST,
 COLOR_SECONDARY,
 COLOR_ERROR,
 COLOR_SUCCESS,
 COLOR_WARNING,
 COLOR_BG_LIGHT,
 COLOR_SURFACE_LIGHT,
 COLOR_SURFACE_RAISED_LIGHT,
 COLOR_BORDER_LIGHT,
 COLOR_TEXT_LIGHT,
 COLOR_MUTED_LIGHT,
 COLOR_PRIMARY_LIGHT,
 COLOR_PRIMARY_DARK_LIGHT,
 COLOR_PRIMARY_CONTRAST_LIGHT,
 COLOR_SECONDARY_LIGHT,
 COLOR_ERROR_LIGHT,
 COLOR_SUCCESS_LIGHT,
 COLOR_WARNING_LIGHT,
} from "@gopvp/common/src/constants/color";
import type { ThemeMode } from "@gopvp/common/src/types/component";

const fontFamily = '"Outfit-Regular", system-ui, sans-serif';

export function getMuiTheme(mode: ThemeMode) {
 const isDark = mode === "dark";

 const primary = isDark ? COLOR_PRIMARY : COLOR_PRIMARY_LIGHT;
 const primaryDark = isDark ? COLOR_PRIMARY_DARK : COLOR_PRIMARY_DARK_LIGHT;
 const primaryContrast = isDark
  ? COLOR_PRIMARY_CONTRAST
  : COLOR_PRIMARY_CONTRAST_LIGHT;
 const surfaceRaised = isDark
  ? COLOR_SURFACE_RAISED
  : COLOR_SURFACE_RAISED_LIGHT;
 const border = isDark ? COLOR_BORDER : COLOR_BORDER_LIGHT;

 return createTheme({
  palette: {
   mode,
   primary: {
    main: primary,
    dark: primaryDark,
    contrastText: primaryContrast,
   },
   secondary: {
    main: isDark ? COLOR_SECONDARY : COLOR_SECONDARY_LIGHT,
    contrastText: isDark ? COLOR_BG : "#ffffff",
   },
   error: { main: isDark ? COLOR_ERROR : COLOR_ERROR_LIGHT },
   success: { main: isDark ? COLOR_SUCCESS : COLOR_SUCCESS_LIGHT },
   warning: { main: isDark ? COLOR_WARNING : COLOR_WARNING_LIGHT },
   background: {
    default: isDark ? COLOR_BG : COLOR_BG_LIGHT,
    paper: isDark ? COLOR_SURFACE : COLOR_SURFACE_LIGHT,
   },
   text: {
    primary: isDark ? COLOR_TEXT : COLOR_TEXT_LIGHT,
    secondary: isDark ? COLOR_MUTED : COLOR_MUTED_LIGHT,
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
      backgroundColor: isDark ? COLOR_SURFACE : COLOR_SURFACE_LIGHT,
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
      backgroundColor: alpha(isDark ? COLOR_TEXT : COLOR_TEXT_LIGHT, 0.3),
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
