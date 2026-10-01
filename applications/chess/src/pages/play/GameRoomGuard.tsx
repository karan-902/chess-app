import { Navigate } from "react-router-dom";
import { useGameContext } from "@gopvp/common/src/contexts/GameContext";
import GameRoom from "@gopvp/chess/src/pages/play/GameRoom";
import { useGameRoomSetup } from "@gopvp/chess/src/hooks/useGameRoomSetup";
import type { IGameRoomProps } from "@gopvp/chess/src/types/component";

export default function GameRoomGuard({ mode }: IGameRoomProps) {
 const { playPath } = useGameContext();
 const { wasAlreadyFinished } = useGameRoomSetup(mode);

 if (wasAlreadyFinished) return <Navigate to={playPath} replace />;
 return <GameRoom mode={mode} />;
}
