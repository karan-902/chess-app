import { useState } from "react";
import clsx from "clsx";
import { Wallet, X, ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { useWalletActionModal } from "@/context/WalletActionModalContext";
import { appbarDepositButton, bottomNavWithdrawLabel } from "@/components/messages";

export interface INavItem {
    id: string;
    path: string;
    icon: LucideIcon;
    label: string;
}

interface IBottomNavProps {
    items: INavItem[];
    activeId: string;
    onSelect: (id: string) => void;
}

function BottomNav({ items, activeId, onSelect }: IBottomNavProps) {
    const [fabOpen, setFabOpen] = useState(false);
    const walletActionModal = useWalletActionModal();
    const sideItems = items.filter((item) => item.id !== "wallet");
    const mid = Math.ceil(sideItems.length / 2);
    const leftItems = sideItems.slice(0, mid);
    const rightItems = sideItems.slice(mid);

    const renderItem = ({ id, icon: Icon, label }: INavItem) => (
        <button
            key={id}
            onClick={() => onSelect(id)}
            className={clsx("bottom-nav-item", id === activeId && "active")}
        >
            <Icon size={20} strokeWidth={id === activeId ? 2 : 1.5} />
            <span className="bottom-nav-label">{label}</span>
            {id === activeId && <span className="bottom-nav-indicator" />}
        </button>
    );

    return (
        <nav className="bottom-nav">
            {fabOpen && (
                <div
                    className="bottom-nav-fab-backdrop"
                    onClick={() => setFabOpen(false)}
                />
            )}
            <div className="bottom-nav-side">{leftItems.map(renderItem)}</div>

            <div className="bottom-nav-fab-slot">
                <div
                    className={clsx(
                        "bottom-nav-fab-actions",
                        fabOpen && "open",
                    )}
                >
                    <div className="bottom-nav-fab-action deposit">
                        <button
                            className="bottom-nav-fab-mini deposit"
                            onClick={() => {
                                setFabOpen(false);
                                walletActionModal.openDeposit();
                            }}
                        >
                            <ArrowDown size={19} strokeWidth={2.5} />
                        </button>
                        <span className="bottom-nav-fab-action-label">
                            {appbarDepositButton}
                        </span>
                    </div>
                    <div className="bottom-nav-fab-action withdraw">
                        <button
                            className="bottom-nav-fab-mini withdraw"
                            onClick={() => {
                                setFabOpen(false);
                                walletActionModal.openWithdraw();
                            }}
                        >
                            <ArrowUp size={19} strokeWidth={2.5} />
                        </button>
                        <span className="bottom-nav-fab-action-label">
                            {bottomNavWithdrawLabel}
                        </span>
                    </div>
                </div>
                <button
                    className={clsx("bottom-nav-fab", fabOpen && "open")}
                    onClick={() => setFabOpen((v) => !v)}
                >
                    <span className="bottom-nav-fab-icon rest">
                        <Wallet size={22} strokeWidth={2} />
                    </span>
                    <span className="bottom-nav-fab-icon close">
                        <X size={22} strokeWidth={2} />
                    </span>
                </button>
            </div>

            <div className="bottom-nav-side">{rightItems.map(renderItem)}</div>
        </nav>
    );
}

export default BottomNav;
