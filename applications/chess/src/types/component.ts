import type { IMatchResultResponse } from "@gopvp/common/src/types/response";
import type {
 GameCategory,
 MoveRecord,
 PieceColor,
} from "@gopvp/chess/src/types/index";

export type GameMode = "pvp" | "pvc";
export type Difficulty = "easy" | "medium" | "hard";

interface ISnapshotMove {
 from: string;
 to: string;
 promotion: string | null;
}

export interface IPvcSnapshot {
 moves: ISnapshotMove[];
 whiteMs: number;
 blackMs: number;
}

export interface IGameRoomProps {
 mode: GameMode;
}

export interface IPlayerRowProps {
 variant: "opponent" | "self";
 active: boolean;
 name: string;
 scoreLabel: string;
 capturedPieces: string[];
 pieceColor: PieceColor;
 advantage: number | null;
 clock: string;
 clockReady: boolean;
 isReconnecting?: boolean;
 firstMoveSeconds?: number | null;
}

export interface IPromotionOverlayProps {
 playerSide: PieceColor;
 onSelect: (piece: string) => void;
 onCancel: () => void;
}

export interface IMoveListProps {
 moveHistory: MoveRecord[];
 fenHistory: string[];
 viewIndex: number | null;
 onJump: (index: number) => void;
}

export interface IReviewControlsProps extends IMoveListProps {
 isReviewing: boolean;
 goBack: () => void;
 goForward: () => void;
}

export interface IGameOverOverlayProps {
 gameEnded: IMatchResultResponse;
 reasonLabel: string;
 resultHeader: string;
 isWinner: boolean;
 isDrawResult: boolean;
 onNewGame: () => void;
}

export interface IResignModalProps {
 open: boolean;
 isPvc: boolean;
 betAmount: number;
 onKeepPlaying: () => void;
 onResign: () => void;
}

export interface IPracticeSheetProps {
 open: boolean;
 onClose: () => void;
 onCancel: () => void;
 onPlay: (difficulty: Difficulty, timeControl: GameCategory) => void;
}
