import type { IPoolResponse } from "@gopvp/common/src/types/response";
import type { MatchOutcome } from "@gopvp/common/src/types/index";
import type { MatchmakingStatus } from "@gopvp/app/src/hooks/useMatchmaking";
import type { RoomStatus } from "@gopvp/app/src/hooks/useRoomMatch";

export interface IMatchRowProps {
 outcome: MatchOutcome;
 opponentName: string;
 time?: number;
 endReason?: string | null;
 amount: number;
 betAmount?: number;
 dateLabel: string;
 selfName?: string;
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
