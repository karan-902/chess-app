import { Navigate } from "react-router-dom";
import { useReduxSelector } from "@/redux/hooks";
import { getGameRoutes } from "@/utils";

export default function EnteredGameRedirect() {
    const enteredGame = useReduxSelector((state) => state.speed.enteredGame);
    if (!enteredGame) return null;
    return <Navigate to={getGameRoutes(enteredGame).PLAY} replace />;
}
