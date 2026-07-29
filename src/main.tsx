import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import { store, persistor } from "./store";
import { SocketProvider } from "./context/SocketContext";
import { WalletActionModalProvider } from "./context/WalletActionModalContext";

import "./styles/index.css";
import "./styles/main.scss";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
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
    </GoogleOAuthProvider>,
);
