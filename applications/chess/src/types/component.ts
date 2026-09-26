import type {
 IMatchResultResponse,
 IPoolResponse,
} from "@gopvp/common/src/types/response";
import type {
 GameCategory,
 MatchOutcome,
 MoveRecord,
 PieceColor,
} from "@gopvp/chess/src/types/index";
import type { MatchmakingStatus } from "@gopvp/chess/src/hooks/useMatchmaking";
import type { RoomStatus } from "@gopvp/chess/src/hooks/useRoomMatch";

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

export interface IMatchRowProps {
 outcome: MatchOutcome;
 opponentName: string;
 category?: GameCategory;
 endReason?: string | null;
 amount: number;
 betAmount?: number;
 dateLabel: string;
 selfName?: string;
}

export interface IPracticeSheetProps {
 open: boolean;
 onClose: () => void;
 onCancel: () => void;
 onPlay: (difficulty: Difficulty, timeControl: GameCategory) => void;
}

export interface IRoomSheetProps {
 open: boolean;
 onClose: () => void;
 onCancel: () => void;
 usdValue: number;
 roomStatus: RoomStatus;
 isOwner: boolean;
 roomCode: string | null;
 expiresInSeconds: number;
 onCreateRoom: (betUsd: number, durationSeconds: number) => void;
 onJoinRoom: (code: string) => void;
 onStartRoom: () => void;
}

export interface IPoolConfirmSheetProps {
 open: boolean;
 onClose: () => void;
 status: MatchmakingStatus;
 queuedPool: IPoolResponse | null;
 confirmPool: IPoolResponse | null;
 secondsLeft: number;
 onLeaveQueue: () => void;
 onConfirmJoin: () => void;
 onConfirmCancel: () => void;
}
