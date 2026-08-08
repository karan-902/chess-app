import { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "sonner";
import { store, persistor } from "./redux/index.ts";
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
                    <PersistGate persistor={persistor}>
                        <SocketProvider>
                            <WalletActionModalProvider>
                                <App />
                                <Toaster
                                    position="top-right"
                                    theme="dark"
                                    swipeDirections={["top", "right"]}
                                    closeButton
                                    duration={5000}
                                />
                            </WalletActionModalProvider>
                        </SocketProvider>
                    </PersistGate>
                </Provider>
            </GoogleOAuthProvider>
        </MuiThemeProvider>
    );
}

createRoot(document.getElementById("root")!).render(
    <AppThemeProvider>
        <Root />
    </AppThemeProvider>,
);
