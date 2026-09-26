import { useParams } from "react-router-dom";
import { getGameRoutes } from "@/utils";
import type { GameSlug } from "@/constants/config";

export function useGame() {
    const game = useParams().game as GameSlug;
    return { game, routes: getGameRoutes(game) };
}
