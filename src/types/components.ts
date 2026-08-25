import type { FormikProps } from "formik";
import type {
    GameCategory,
    IgameEndedResponse,
    IGameHistoryItem,
    MoveRecord,
} from "./types";
import type { ILoginResponse, TransactionType } from "./utils";
import type { RematchStatus } from "@/hooks/useRematch";

export type GameMode = "pvp" | "pvc";
export type Difficulty = "easy" | "medium" | "hard";
export type TimeControl = "bullet" | "blitz" | "rapid" | "classical";
export type GamePhase = "lobby" | "playing";

export interface IEmailFormValues {
    username: string;
    email: string;
    password: string;
    confirm: string;
    country: string;
}

export interface IEmailFormScreenProps {
    onBack: () => void;
    onRegistered: (email: string, password: string) => void;
}

export interface IGameRoomNavPayload {
    game_id: string;
    your_color: "white" | "black";
    opponent: {
        id: string;
        username: string;
        elo_rating: number;
        avatar_seed: string | null;
    };
    stake_amount: number;
    time_seconds: number;
    room_code?: string;
}
export type Step = "method" | "email" | "otp";
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

export interface IPlayerRowProps {
    variant: "opponent" | "self";
    active: boolean;
    name: string;
    eloLabel: string;
    capturedPieces: string[];
    pieceColor: "w" | "b";
    advantage: number | null;
    clock: string;
    clockReady: boolean;
    graceSecondsRemaining?: number | null;
}

export interface IPromotionOverlayProps {
    playerSide: "w" | "b";
    onSelect: (piece: string) => void;
    onCancel: () => void;
}

export interface IMoveListProps {
    moveHistory: MoveRecord[];
    fenHistory: string[];
    viewIndex: number | null;
    onJump: (index: number) => void;
}

export interface IGameOverOverlayProps {
    gameEnded: IgameEndedResponse;
    reasonLabel: string;
    resultHeader: string;
    isWinner: boolean;
    isDrawResult: boolean;
    settlementUsd: number;
    isPvc: boolean;
    canAffordRematch: boolean;
    rematchStatus: RematchStatus;
    rematchSecs: number;
    onNewGame: () => void;
    onRematch: () => void;
}

export interface IResignModalProps {
    open: boolean;
    isPvc: boolean;
    stakeAmount: number;
    onKeepPlaying: () => void;
    onResign: () => void;
}

export interface IEmailValues {
    email: string;
}

export interface IEmailScreenProps {
    formik: FormikProps<IEmailValues>;
    error: string | null;
    isGoogleProcessing: boolean;
    onGoogleLogin: () => void;
}

export interface IPasswordValues {
    password: string;
}

export interface IPasswordScreenProps {
    verifiedEmail: string;
    formik: FormikProps<IPasswordValues>;
    error: string | null;
    onChangeEmail: () => void;
}

export interface IWaitingApprovalScreenProps {
    onBack: () => void;
}

export interface IMethodScreenProps {
    onEmailSelected: () => void;
    onGoogleSelected: () => void;
    isGoogleProcessing: boolean;
}

export interface IVerifyEmailFormProps {
    email: string;
    autoSend?: boolean;
    showHeading?: boolean;
    onVerified: () => void;
    onBack?: () => void;
}

export interface ISelectCountryScreenProps {
    showHeading?: boolean;
    onSelected?: () => void;
}

export type TxDateFilter = { from?: number; to?: number };

export interface ITransactionFilterDrawerProps {
    open: boolean;
    onClose: () => void;
    typeFilter: TransactionType[];
    setTypeFilter: (types: TransactionType[]) => void;
    dateFilter: TxDateFilter;
    setDateFilter: (filter: TxDateFilter) => void;
}

export interface IMatchRowProps {
    outcome: "win" | "loss" | "draw";
    opponentName: string;
    category: GameCategory;
    endReason: string;
    amount: number;
    stakeAmount: number;
    dateLabel: string;
    selfName?: string;
}

export interface IMatchListProps {
    items: IGameHistoryItem[];
    showSelf: boolean;
    currentUserId: string | undefined;
    loadingMore: boolean;
    loadMore: () => void;
}

export interface IEditProfileDrawerProps {
    open: boolean;
    onClose: () => void;
    session: ILoginResponse;
}

export interface IDurationWheelProps {
    value: number;
    onChange: (value: number) => void;
}

export interface IChipSelectProps<T extends string> {
    options: T[];
    value: T;
    onChange: (value: T) => void;
    label: (option: T) => string;
    subLabel?: (option: T) => string;
    customClass?: string;
}

export type MatchesSubtab = "history" | "global" | "stats";
export type LoginStep = "email" | "password" | "country" | "waiting-approval";
export type UsernameCheckStatus = "idle" | "checking" | "available" | "taken";
export type ApproveDeviceStatus = "confirm" | "approved" | "invalid";
export type RoomTab = "create" | "join";
