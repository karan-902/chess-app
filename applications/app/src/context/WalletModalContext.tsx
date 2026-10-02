import {
 createContext,
 useContext,
 useMemo,
 useState,
 type PropsWithChildren,
} from "react";

type WalletModal = "deposit" | "withdraw" | null;

interface IWalletModalContextValue {
 openModal: WalletModal;
 openDeposit: () => void;
 openWithdraw: () => void;
 close: () => void;
}

const WalletModalContext = createContext<IWalletModalContextValue | null>(null);

export function WalletModalProvider({ children }: PropsWithChildren) {
 const [openModal, setOpenModal] = useState<WalletModal>(null);
 const actions = useMemo(
  () => ({
   openDeposit: () => setOpenModal("deposit"),
   openWithdraw: () => setOpenModal("withdraw"),
   close: () => setOpenModal(null),
  }),
  [],
 );
 const value = useMemo(() => ({ openModal, ...actions }), [openModal, actions]);

 return (
  <WalletModalContext.Provider value={value}>
   {children}
  </WalletModalContext.Provider>
 );
}

export function useWalletModal() {
 const ctx = useContext(WalletModalContext);
 if (!ctx) {
  throw new Error("useWalletModal must be used within a WalletModalProvider");
 }
 return ctx;
}
