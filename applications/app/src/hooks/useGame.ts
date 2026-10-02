import { useParams } from "react-router-dom";
import { getGamePath } from "@gopvp/app/src/utils";
import { GAMES, type GameSlug } from "@gopvp/app/src/config/game";

export function useGame() {
 const game = useParams().game as GameSlug;
 return {
  game,
  gamePath: getGamePath(game),
  gameLabel: GAMES[game].label,
  gameModule: GAMES[game].module,
 };
}
