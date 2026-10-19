import { useParams } from "react-router-dom";
import { getGamePath } from "@gopvp/app/src/utils";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { GAMES, type GameSlug } from "@gopvp/app/src/config/game";

export function useGame() {
 const enteredGame = useReduxSelector((state) => state.game.enteredGame);
 const game = (useParams().game ?? enteredGame) as GameSlug;
 return {
  game,
  gamePath: getGamePath(game),
  gameLabel: GAMES[game]?.label,
  gameModule: GAMES[game]?.module,
 };
}
