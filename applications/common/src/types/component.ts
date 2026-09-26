import type { FormikProps } from "formik";
import type { ILoginResponse, IMatchHistoryItem, IPoolResponse } from "@gopvp/common/src/types/response";

export type LoginStep = "email" | "password" | "country"; // | "waiting-approval"
export type ApproveDeviceStatus = "confirm" | "approved" | "invalid";
export type MatchesSubtab = "history" | "global" | "stats";
export type RoomTab = "create" | "join";

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
 verifiedUsername: string;
 formik: FormikProps<IPasswordValues>;
 error: string | null;
 onChangeEmail: () => void;
}

// export interface IWaitingApprovalScreenProps {
//  onBack: () => void;
// }

export interface IEmailFormScreenProps {
 onRegistered: (email: string, password: string) => void;
}

export interface ISelectCountryScreenProps {
 showHeading?: boolean;
 onSelected?: () => void;
}

export interface IEditProfileDrawerProps {
 open: boolean;
 onClose: () => void;
 session: ILoginResponse;
}

export interface ILeaderboardPlayerModalProps {
 playerId: string | null;
 onClose: () => void;
}

export interface IMatchListProps {
 items: IMatchHistoryItem[];
 currentUsername: string | undefined;
 loadingMore: boolean;
 loadMore: () => void;
}

export interface IFilterDropdownProps<T extends string> {
 options: T[];
 value: T;
 onChange: (value: T) => void;
 label: (option: T) => string;
}

export interface IChipSelectProps<T extends string> {
 options: T[];
 value: T;
 onChange: (value: T) => void;
 label: (option: T) => string;
 subLabel?: (option: T) => string;
 customClass?: string;
}

export interface IDurationWheelProps {
 value: number;
 onChange: (value: number) => void;
}

export interface IBetSheetProps {
 open: boolean;
 onClose: () => void;
 pools: IPoolResponse[];
 poolsLoading: boolean;
 usdValue: number;
 onPoolPlay: (pool: IPoolResponse) => void;
 onPracticeOpen: () => void;
 onRoomOpen: () => void;
 onInsufficientBalance: () => void;
}
