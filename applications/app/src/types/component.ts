import type { ComponentType, ReactNode, Ref } from "react";
import type { FormikProps } from "formik";
import type {
 IMatchHistoryItem,
 IPoolResponse,
} from "@gopvp/common/src/types/response";
import type { MatchOutcome } from "@gopvp/common/src/types/index";
import type { IPoolLabelProps } from "@gopvp/common/src/types/component";
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
 isProcessing?: boolean;
}

export interface IWalletInfoNoteProps {
 text: string;
}

export interface ICountrySelectProps<TValues extends { country: string }> {
 formik: FormikProps<TValues>;
}

export interface ICopyButtonProps {
 text: string;
 showLabel?: boolean;
}

export interface IUsernameFieldProps<TValues extends { username: string }> {
 formik: FormikProps<TValues>;
 inputRef?: Ref<HTMLInputElement>;
 customClass?: string;
 showHint?: boolean;
 hideClear?: boolean;
}

export interface IStatRow {
 label: string;
 value: string | number;
 icon?: LucideIcon;
 tone?: "gold" | "silver" | "bronze";
 isPrize?: boolean;
}

export interface IStatListProps {
 rows: IStatRow[] | null;
 skeletonRows: number;
 customClass?: string;
}

export interface IMatchRowProps {
 outcome: MatchOutcome;
 headline: string;
 resultTag?: string;
 amount: number;
 onClick?: () => void;
}

export type TResultTone = "win" | "loss" | "neutral" | "gold";

export interface IResultTile {
 label: string;
 value: string | number;
 icon?: LucideIcon;
 highlight?: boolean;
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
 versus?: boolean;
 hideGlow?: boolean;
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
 myName: string;
 roomFee: number;
 roomTimeMs: number;
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
 opponentName: string;
 confirmTone: number;
 PoolLabel: ComponentType<IPoolLabelProps>;
 secondsLeft: number;
 onLeaveQueue: () => void;
 onConfirmJoin: () => void;
 onConfirmCancel: () => void;
 onRetry: () => void;
 onPickAnotherBet: () => void;
}

export interface IStakeTicketProps {
 entry: number;
 prize: number;
}

export interface IPoolCardProps {
 pool: IPoolResponse;
 PoolLabel: ComponentType<IPoolLabelProps>;
 tone: number;
 isInsufficient?: boolean;
 onPress?: () => void;
}

export interface IFaceOffProps {
 opponentName?: string | null;
}

export interface IMatchDeckProps {
 isRevealed: boolean;
 opponentName: string;
}

export interface IMatchTicketStat {
 label: string;
 value: string;
 isWin?: boolean;
}

export interface IMatchTicketProps {
 status: MatchmakingStatus;
 title?: string;
 stats: IMatchTicketStat[];
 myName: string;
 opponentName: string;
}

export interface IChessLogoProps {
 size: number;
 showText: boolean;
 withCursor?: boolean;
 muted?: boolean;
}

export interface IAuthFooter {
 title: string;
 tagline: string;
 actionText: string;
 to: string;
}

export interface IAuthLayoutProps {
 title: string;
 titleAccent?: string;
 subtitle?: string;
 subtitleAccent?: string;
 footer?: ReactNode;
 footerCard?: IAuthFooter;
 children: ReactNode;
}

export interface IEmptyStateProps {
 title?: string;
 description?: string;
}

export interface INotificationProps {
 customClass?: string;
}
