import { lazy } from "react";
import ChessPoolLabel from "@gopvp/chess/src/pages/play/ChessPoolLabel";
import type { IGameModule } from "@gopvp/common/src/types/component";

export const chessGame: IGameModule = {
 Preview: lazy(() => import("@gopvp/chess/src/components/board/BoardPreview")),
 PoolLabel: ChessPoolLabel,
 GameRoom: lazy(() => import("@gopvp/chess/src/pages/play/ChessGameRoom")),
 Practice: lazy(() => import("@gopvp/chess/src/pages/play/ChessPractice")),
};
