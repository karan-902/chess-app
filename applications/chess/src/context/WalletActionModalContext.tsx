import { createContext, useContext, useState, type ReactNode } from "react";

type WalletActionModal = "deposit" | "withdraw" | null;

interface IWalletActionModalContextValue {
    openModal: WalletActionModal;
    openDeposit: () => void;
    openWithdraw: () => void;
    close: () => void;
}

const WalletActionModalContext =
    createContext<IWalletActionModalContextValue | null>(null);

export function WalletActionModalProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [openModal, setOpenModal] = useState<WalletActionModal>(null);

    return (
        <WalletActionModalContext.Provider
            value={{
                openModal,
                openDeposit: () => setOpenModal("deposit"),
                openWithdraw: () => setOpenModal("withdraw"),
                close: () => setOpenModal(null),
            }}
        >
            {children}
        </WalletActionModalContext.Provider>
    );
}

export function useWalletActionModal() {
    const ctx = useContext(WalletActionModalContext);
    if (!ctx) {
        throw new Error(
            "useWalletActionModal must be used within a WalletActionModalProvider",
        );
    }
    return ctx;
}
