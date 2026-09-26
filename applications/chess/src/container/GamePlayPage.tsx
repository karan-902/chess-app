import type { ComponentType } from "react";
import ChessPlayPage from "@gopvp/chess/src/pages/play/PlayPage";
import { useGame } from "@gopvp/chess/src/hooks/useGame";
import type { GameSlug } from "@gopvp/chess/src/constants/config";

const GAME_PLAY_PAGES: Record<GameSlug, ComponentType> = {
    chess: ChessPlayPage,
};

export default function GamePlayPage() {
    const { game } = useGame();
    const PlayPage = GAME_PLAY_PAGES[game];
    return <PlayPage />;
}
