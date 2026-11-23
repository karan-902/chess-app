import { createRoot } from "react-dom/client";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { getMuiTheme } from "@gopvp/common/src/theme";
import App from "@gopvp/admin/src/App";
import { ToastProvider } from "@gopvp/admin/src/context/ToastContext";
import "./styles/main.scss";

createRoot(document.getElementById("root")!).render(
 <MuiThemeProvider theme={getMuiTheme("dark")}>
  <CssBaseline />
  <ToastProvider>
   <App />
  </ToastProvider>
 </MuiThemeProvider>,
);
