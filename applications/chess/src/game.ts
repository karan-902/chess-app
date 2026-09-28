import { lazy } from "react";
import ChessPoolLabel from "@gopvp/chess/src/pages/play/ChessPoolLabel";
import ChessMatchIcon from "@gopvp/chess/src/pages/history/ChessMatchIcon";
import { GAME_END_REASON_LABELS } from "@gopvp/chess/src/constants/label";
import type { IGameModule } from "@gopvp/common/src/types/component";

export const chessGame: IGameModule = {
 Preview: lazy(() => import("@gopvp/chess/src/components/board/BoardPreview")),
 PoolLabel: ChessPoolLabel,
 GameRoom: lazy(() => import("@gopvp/chess/src/pages/play/ChessGameRoom")),
 Practice: lazy(() => import("@gopvp/chess/src/pages/play/ChessPractice")),
 Rules: lazy(() => import("@gopvp/chess/src/pages/rules/ChessRules")),
 MatchIcon: ChessMatchIcon,
 endReasonLabels: GAME_END_REASON_LABELS,
};
