import { useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { store, persistor } from "@gopvp/chess/src/redux/index.ts";
import { SocketProvider } from "@gopvp/chess/src/context/SocketContext";
import { WalletActionModalProvider } from "@gopvp/chess/src/context/WalletActionModalContext";
import { AppThemeProvider, useAppTheme } from "@gopvp/chess/src/context/ThemeContext";
import { getMuiTheme } from "@gopvp/common/src/theme";
import { googleClientId } from "@gopvp/common/src/constants/env";

import "./styles/main.scss";
import App from "@gopvp/chess/src/App.tsx";

function Root() {
    const { mode } = useAppTheme();
    const muiTheme = useMemo(() => getMuiTheme(mode), [mode]);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <GoogleOAuthProvider clientId={googleClientId}>
                <Provider store={store}>
                    <PersistGate persistor={persistor}>
                        <SocketProvider>
                            <WalletActionModalProvider>
                                <App />
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
