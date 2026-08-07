import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "sonner";
import { store, persistor } from "./redux/index.ts";
import { hideLoader } from "./redux/loader.slice";
import { SocketProvider } from "./context/SocketContext";
import { WalletActionModalProvider } from "./context/WalletActionModalContext";
import { theme } from "./theme";
import BackdropLoader from "./components/base/BackdropLoader/BackdropLoader";

import "./styles/main.scss";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>,
);
