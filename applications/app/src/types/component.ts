import type { ReactNode, Ref } from "react";
import type { FormikProps } from "formik";
import type {
 IMatchHistoryItem,
 IPoolResponse,
} from "@gopvp/common/src/types/response";
import type { MatchOutcome } from "@gopvp/common/src/types/index";
import type {
 LucideIcon,
 TIconName,
} from "@gopvp/common/src/components/images";
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
 customClass?: string;
}

export interface ICopyButtonProps {
 text: string;
}

export interface IUsernameFieldProps<TValues extends { username: string }> {
 formik: FormikProps<TValues>;
 inputRef?: Ref<HTMLInputElement>;
 customClass?: string;
}

export interface IStatRow {
 label: string;
 value: string | number;
 icon?: LucideIcon;
 tone?: "gold" | "silver" | "bronze";
}

export interface IStatListProps {
 rows: IStatRow[] | null;
 skeletonRows: number;
 customClass?: string;
}

export interface IMatchRowProps {
 outcome: MatchOutcome;
 headline: string;
 amount: number;
 onClick?: () => void;
}

export type TResultTone = "win" | "loss" | "neutral" | "gold";

export interface IResultTile {
 label: string;
 value: string | number;
}

export interface IResultSheetProps {
 open: boolean;
 onClose: () => void;
 tone: TResultTone;
 title?: string;
 subtitle?: string;
 amount?: string;
 tiles: IResultTile[] | null;
 skeletonTiles: number;
 tileIcon?: TIconName;
 children?: ReactNode;
}

export interface IMatchInfoSheetProps {
 match: IMatchHistoryItem | null;
 onClose: () => void;
}

export interface IRoomSheetProps {
 open: boolean;
 onClose: () => void;
 onCancel: () => void;
 usdValue: number;
 roomStatus: RoomStatus;
 isOwner: boolean;
 roomCode: string | null;
 opponentName: string;
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
 customClass?: string;
}

export interface IEmptyStateProps {
 title?: string;
 description?: string;
}

export interface INotificationProps {
 customClass?: string;
}
