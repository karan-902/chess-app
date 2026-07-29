import clsx from "clsx";
import { Link } from "react-router";
import Box from "@/components/base/Box/Box";
import KingStakeLogo from "@/components/constants";
import "./appbar.scss";

interface IAppBarProps {
    children?: React.ReactNode;
    customClass?: string;
}

function AppBar({ children, customClass }: IAppBarProps) {
    return (
        <Box as="header" customClass={clsx("common-appbar", customClass)}>
            <Link to="/lobby" className="appbar-brand" title="Go to Lobby">
                <KingStakeLogo size={26} showText={false} withCursor />
            </Link>
            {children}
        </Box>
    );
}

export default AppBar;
