import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import { store, persistor } from "./store";
import { SocketProvider } from "./context/SocketContext";
import { CurrencyProvider } from "./context/CurrencyContext";

import "./styles/index.css";
import "./styles/main.scss";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SocketProvider>
                    <CurrencyProvider>
                        <App />
                        <Toaster
                            position="top-right"
                            theme="dark"
                            swipeDirections={["top", "right"]}
                            closeButton
                            duration={5000}
                        />
                    </CurrencyProvider>
                </SocketProvider>
            </PersistGate>
        </Provider>
    </GoogleOAuthProvider>,
);
