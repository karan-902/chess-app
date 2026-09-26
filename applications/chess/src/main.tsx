import { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { store, hydrateSession, hydrateSpeedState } from "./redux/index.ts";
import { SocketProvider } from "./context/SocketContext";
import { WalletActionModalProvider } from "./context/WalletActionModalContext";
import { AppThemeProvider, useAppTheme } from "./context/ThemeContext";
import { getMuiTheme } from "./theme";

import "./styles/main.scss";
import App from "./App.tsx";

function Root() {
    const { mode } = useAppTheme();
    const muiTheme = useMemo(() => getMuiTheme(mode), [mode]);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <Provider store={store}>
                    <SocketProvider>
                        <WalletActionModalProvider>
                            <App />
                        </WalletActionModalProvider>
                    </SocketProvider>
                </Provider>
            </GoogleOAuthProvider>
        </MuiThemeProvider>
    );
}

const renderApp = async () => {
    await Promise.all([hydrateSession(), hydrateSpeedState()]);
    createRoot(document.getElementById("root")!).render(
        <AppThemeProvider>
            <Root />
        </AppThemeProvider>,
    );
};

renderApp();
