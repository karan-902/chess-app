import { Navigate } from "react-router-dom";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { getGameRoutes } from "@gopvp/app/src/utils";

export default function EnteredGameRedirect() {
 const enteredGame = useReduxSelector((state) => state.game.enteredGame);
 if (!enteredGame) return null;
 return <Navigate to={getGameRoutes(enteredGame).PLAY} replace />;
}
