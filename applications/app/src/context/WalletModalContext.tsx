import { createContext, useContext, useState, type ReactNode } from "react";

type WalletModal = "deposit" | "withdraw" | null;

interface IWalletModalContextValue {
 openModal: WalletModal;
 openDeposit: () => void;
 openWithdraw: () => void;
 close: () => void;
}

const WalletModalContext = createContext<IWalletModalContextValue | null>(null);

export function WalletModalProvider({ children }: { children: ReactNode }) {
 const [openModal, setOpenModal] = useState<WalletModal>(null);

 return (
  <WalletModalContext.Provider
   value={{
    openModal,
    openDeposit: () => setOpenModal("deposit"),
    openWithdraw: () => setOpenModal("withdraw"),
    close: () => setOpenModal(null),
   }}
  >
   {children}
  </WalletModalContext.Provider>
 );
}

export function useWalletModal() {
 const ctx = useContext(WalletModalContext);
 if (!ctx) {
  throw new Error(
   "useWalletActionModal must be used within a WalletActionModalProvider",
  );
 }
 return ctx;
}
