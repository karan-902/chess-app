import type { ReactNode } from "react";
import type { FormikProps } from "formik";
import type { IPoolResponse } from "@gopvp/common/src/types/response";
import type { MatchOutcome } from "@gopvp/common/src/types/index";
import type { MatchmakingStatus } from "@gopvp/app/src/hooks/useMatchmaking";
import type { RoomStatus } from "@gopvp/app/src/hooks/useRoomMatch";

export interface IWalletSheetShellProps {
 open: boolean;
 isSuccess: boolean;
 onClose: () => void;
 children: ReactNode;
}

export interface IWalletSuccessStageProps {
 amountUsd: number;
 title: string;
}

export interface IWalletInfoNoteProps {
 text: string;
}

export interface ICountrySelectProps<TValues extends { country: string }> {
 formik: FormikProps<TValues>;
}

export interface IStatRow {
 label: string;
 value: string | number;
}

export interface IStatListProps {
 rows: IStatRow[] | null;
 skeletonRows: number;
}

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

export interface IChessLogoProps {
 size: number;
 showText: boolean;
 withCursor?: boolean;
 muted?: boolean;
}

export interface IAuthLayoutProps {
 title: ReactNode;
 subtitle?: ReactNode;
 footer?: ReactNode;
 children: ReactNode;
}

export interface IEmptyStateProps {
 title?: string;
 description?: string;
}

export interface INotificationProps {
 customClass?: string;
}
