import type { IMatchResultResponse } from "@gopvp/common/src/types/response";
import type { MatchOutcome } from "@gopvp/common/src/types/index";
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
 outcome: MatchOutcome;
 isPvc: boolean;
 reasonLabel: string;
 opponentName: string;
 onNewGame: () => void;
}

export interface IResignSheetProps {
 open: boolean;
 isPvc: boolean;
 betAmount: number;
 onKeepPlaying: () => void;
 onResign: () => void;
}

export interface IPracticeSheetProps {
 open: boolean;
 onClose: () => void;
 onPlay: (difficulty: Difficulty, timeControl: GameCategory) => void;
}

export interface IDroppableSquareProps {
 square: string;
 className: string;
 style: React.CSSProperties;
 onClick: () => void;
 onContextMenu: (e: React.MouseEvent) => void;
 premoveMode?: boolean;
 children: React.ReactNode;
}

export interface IDraggablePieceProps {
 square: string;
 code: string;
 col: number;
 row: number;
 className: string;
 onClick: () => void;
 draggable: boolean;
 hidden?: boolean;
}

export interface IMatchLoaderProps {
 matchId: string;
}

export interface IPieceIconProps {
 code: string;
 className?: string;
 style?: React.CSSProperties;
 onPointerDown?: (e: React.PointerEvent<SVGSVGElement>) => void;
}

export interface IChessBoardProps {
 fen: string;
 selectedSquare?: string | null;
 legalMoves?: string[];
 attackedSquares?: string[];
 checkSquare?: string | null;
 stalemateSquare?: string | null;
 flashSquare?: string | null;
 onSquareClick?: (square: string, viaDrag?: boolean) => void;
 onSquareRightClick?: (square: string) => void;
 lastMove?: { from: string; to: string } | null;
 flipped?: boolean;
 premoveMode?: boolean;
 premoveSquares?: string[];
 premoveMoves?: { from: string; to: string }[];
 draggableColor?: "w" | "b";
}
