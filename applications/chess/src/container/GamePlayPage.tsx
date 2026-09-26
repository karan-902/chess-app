import type { ComponentType } from "react";
import ChessPlayPage from "@/pages/play/PlayPage";
import { useGame } from "@/hooks/useGame";
import type { GameSlug } from "@/constants/config";

const GAME_PLAY_PAGES: Record<GameSlug, ComponentType> = {
    chess: ChessPlayPage,
};

export default function GamePlayPage() {
    const { game } = useGame();
    const PlayPage = GAME_PLAY_PAGES[game];
    return <PlayPage />;
}
