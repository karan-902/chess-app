import { useParams } from "react-router-dom";
import { getGameRoutes } from "@gopvp/app/src/utils";
import { GAMES, type GameSlug } from "@gopvp/app/src/constants/config";

export function useGame() {
 const game = useParams().game as GameSlug;
 return { game, routes: getGameRoutes(game), gameModule: GAMES[game].module };
}
