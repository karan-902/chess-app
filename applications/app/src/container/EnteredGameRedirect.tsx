import { Navigate } from "react-router-dom";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { getGamePath } from "@gopvp/app/src/utils";
import { ROUTES } from "@gopvp/app/src/constants/route";

export default function EnteredGameRedirect() {
 const enteredGame = useReduxSelector((state) => state.game.enteredGame);
 return (
  <Navigate
   to={enteredGame ? getGamePath(enteredGame) : ROUTES.PICK_GAME}
   replace
  />
 );
}
