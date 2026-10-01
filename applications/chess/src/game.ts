import { lazy } from "react";
import ChessPoolLabel from "@gopvp/chess/src/pages/play/ChessPoolLabel";
import { GAME_LOGO_PATH } from "@gopvp/chess/src/constants/asset";
import type { IGameModule } from "@gopvp/common/src/types/component";

const loadGameRoom = () => import("@gopvp/chess/src/pages/play/ChessGameRoom");

export const chessGame: IGameModule = {
 Preview: lazy(() => import("@gopvp/chess/src/components/board/BoardPreview")),
 PoolLabel: ChessPoolLabel,
 GameRoom: lazy(loadGameRoom),
 preloadGameRoom: loadGameRoom,
 logoSrc: GAME_LOGO_PATH,
 Practice: lazy(() => import("@gopvp/chess/src/pages/play/ChessPractice")),
 Rules: lazy(() => import("@gopvp/chess/src/pages/rules/ChessRules")),
};
