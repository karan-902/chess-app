import { Outlet, useParams } from "react-router-dom";
import EnteredGameRedirect from "@/container/EnteredGameRedirect";
import { isGameSlug } from "@/utils";

export default function GameRoute() {
    const { game } = useParams();
    if (!isGameSlug(game)) return <EnteredGameRedirect />;
    return <Outlet />;
}
