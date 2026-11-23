import type { ElementType } from "react";
import type { ADMIN_API_STATUS } from "@gopvp/admin/src/constants/endpoint";

export type TAdminNavItem = {
 label: string;
 icon: ElementType;
 path?: string;
 roles?: Set<string>;
};

export type TAdminNavSection = {
 title: string;
 items: TAdminNavItem[];
};

export type TAdminSession = {
 id: string;

 email: string;
 name: string;
 role: string;
 last_login: number | null;
};

export type TAdminLoginBody = {
 email: string;
 password: string;
};

export type TAdminOtpRequiredResponse = {
 status: typeof ADMIN_API_STATUS.OTP_REQUIRED;
 ticket: string;
};

export type TAdminVerifyOtpBody = {
 ticket: string;
 otp: string;
 fingerprint: string;
};

export type TAdminDevicePendingResponse = {
 status: typeof ADMIN_API_STATUS.DEVICE_PENDING;
 message: string;
};

export type TAdminVerifyOtpResponse =
 TAdminSession | TAdminDevicePendingResponse;

export type TAdminSpeedCheck = {
 type: string;
 checked_from: number;
 checked_until: number;
 transactions: number;
 new_issues: number;
 created: number;
};

export type TAdminDashboardNow = {
 live_matches: number;
 live_players: number;
 stuck_matches: number;
 open_problems: number;
 review_deposits: number;
 stuck_withdraws: number;
 last_check: TAdminSpeedCheck | null;
 funds_short: boolean;
};

export type TAdminDashboardMoney = {
 deposits_in: number;
 withdraws_out: number;
 fees_kept: number;
 speed_fees: number;
 profit: number;
 profit_taken_out: number;
 players_money: number;
};

export type TAdminList<T> = {
 has_more: boolean;
 object: string;
 data: T[] | null;
 page_id: string | null;
};

export type TAdminDepositRow = {
 id: string;
 username: string;
 amount: number;
 status: string;
 has_problem: boolean;
 created: number;
};

export type TAdminWithdrawRow = TAdminDepositRow & {
 is_stuck: boolean;
};

export type TAdminIssue = {
 id: string;
 type: string;
 source_id: string;
 detail: string;
 status: string;
 resolved_by: string | null;
 resolved_by_name: string | null;
 resolution_note: string | null;
 resolved: number | null;
 created: number;
 modified: number;
};

export type TAdminIssueRecord = {
 kind: string;
 id: string;
 status: string;
 provider_id: string;
 amount: number;
 target_amount: number | null;
};

export type TAdminIssueDetail = {
 issue: TAdminIssue;
 record: TAdminIssueRecord | null;
 actions: { resolve: boolean; retry: boolean; adjust: boolean };
};

export type TAdminSpeedStatusBody = {
 type: string;
 id: string;
};

export type TAdminSpeedStatus = {
 record: TAdminIssueRecord | null;
 speed: { id: string; status: string } | null;
};

export type TAdminResolveBody = {
 note: string;
};

export type TAdminRetryResponse = {
 fixed: boolean;
 issue: TAdminIssue;
};

export type TAdminAdjustBody = {
 direction: string;
 purpose: string;
 amount: number;
 reason: string;
 user_id?: string;
};

export type TAdminUserRef = {
 id: string;
 username: string;
 email: string;
};

export type TAdminDepositDetail = {
 deposit: { id: string; user: TAdminUserRef };
};

export type TAdminWithdrawDetail = {
 withdraw: { id: string; user: TAdminUserRef };
};

export type TAdminPlayerDetail = {
 player: TAdminUserRef;
 balance: { total: number; playable: number; withdrawable: number };
};

export type TAdminOption = {
 label: string;
 value: string;
};

export type TAdminErrorNoticeProps = {
 message: string;
};

export type TAdminField = {
 label: string;
 value: string;
 sub?: string;
 tone?: TAdminStatTone;
 isChip?: boolean;
 chipTone?: string;
};

export type TAdminFieldListProps = {
 fields: TAdminField[];
};

export type TAdminModalProps = {
 issueId: string;
 onClose: () => void;
 onDone: () => void;
};

export type TAdminAdjustModalProps = TAdminModalProps & {
 issueType: string;
 record: TAdminIssueRecord | null;
};

export type TAdminRetryModalProps = TAdminModalProps & {
 onNotFixed: () => void;
};

export type TAdminSpeedCheckCardProps = {
 body: TAdminSpeedStatusBody | null;
};

export type TAdminStatTone = "danger" | "warning" | "success";

export type TAdminStatCard = {
 label: string;
 icon: ElementType;
 value: string;
 hint?: string;
 tone?: TAdminStatTone;
 path?: string;
};

export type TAdminMoneyRange = {
 label: string;
 days: number;
};

export type TApiErrorBody = {
 errors?: { message: string; type?: string }[];
};
