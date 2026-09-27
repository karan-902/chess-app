import PlayPage from "@gopvp/chess/src/pages/play/PlayPage";
import { chessGame } from "@gopvp/chess/src/game";
import { useGame } from "@gopvp/chess/src/hooks/useGame";
import type { GameSlug } from "@gopvp/chess/src/constants/config";
import type { IGameModule } from "@gopvp/common/src/types/component";

const GAME_MODULES: Record<GameSlug, IGameModule> = {
    chess: chessGame,
};

export default function GamePlayPage() {
    const { game } = useGame();
    return <PlayPage gameModule={GAME_MODULES[game]} />;
}
