import { Outlet, useParams } from "react-router-dom";
import EnteredGameRedirect from "@gopvp/chess/src/container/EnteredGameRedirect";
import { isGameSlug } from "@gopvp/chess/src/utils";

export default function GameRoute() {
    const { game } = useParams();
    if (!isGameSlug(game)) return <EnteredGameRedirect />;
    return <Outlet />;
}
