import clsx from "clsx";
import { Link } from "react-router";
import type { INavItem } from "./BottomNav";
import KingStakeLogo from "@/components/constants";

interface ISidebarNavProps {
    items: INavItem[];
    activeId: string;
    onSelect: (id: string) => void;
}

function SidebarNav({ items, activeId, onSelect }: ISidebarNavProps) {
    return (
        <aside className="sidebar-nav">
            <Link to="/lobby" className="sidebar-logo" title="Go to Lobby">
                <KingStakeLogo size={22} showText={false} />
            </Link>
            <nav className="sidebar-items">
                {items.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => onSelect(id)}
                        className={clsx(
                            "sidebar-item",
                            id === activeId && "active",
                        )}
                    >
                        {id === activeId && (
                            <span className="sidebar-indicator" />
                        )}
                        <Icon
                            size={18}
                            strokeWidth={id === activeId ? 2 : 1.5}
                            className="sidebar-icon"
                        />
                        <span className="sidebar-label">{label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}

export default SidebarNav;
