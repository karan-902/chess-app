import { useParams } from "react-router-dom";
import { getGameRoutes } from "@gopvp/chess/src/utils";
import type { GameSlug } from "@gopvp/chess/src/constants/config";

export function useGame() {
    const game = useParams().game as GameSlug;
    return { game, routes: getGameRoutes(game) };
}
