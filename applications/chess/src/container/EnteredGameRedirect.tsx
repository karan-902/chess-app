import { Navigate } from "react-router-dom";
import { useReduxSelector } from "@gopvp/chess/src/redux/hooks";
import { getGameRoutes } from "@gopvp/chess/src/utils";

export default function EnteredGameRedirect() {
    const enteredGame = useReduxSelector((state) => state.game.enteredGame);
    if (!enteredGame) return null;
    return <Navigate to={getGameRoutes(enteredGame).PLAY} replace />;
}
