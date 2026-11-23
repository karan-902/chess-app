export const ADMIN_ENDPOINTS = {
 LOGIN: "/admin/auth/login",
 VERIFY_OTP: "/admin/auth/verify-otp",
 GENERATE_TOKEN: "/admin/auth/generate-token",
 LOGOUT: "/admin/auth/logout",
 DASHBOARD_NOW: "/admin/dashboard/now",
 DASHBOARD_MONEY: "/admin/dashboard/money",
 DEPOSITS: "/admin/deposits",
 WITHDRAWS: "/admin/withdraws",
 PLAYERS: "/admin/players",
 ISSUES: "/admin/issues",
 SPEED_STATUS: "/admin/speed-status",
} as const;

export const ADMIN_TRANSFER_STATUS = {
 COMPLETED: "COMPLETED",
 FAILED: "FAILED",
} as const;

export const ADMIN_ISSUE_STATUS = {
 OPEN: "OPEN",
 RESOLVED: "RESOLVED",
} as const;

export const ADMIN_ISSUE_TYPE = {
 PAYMENT_WITHOUT_DEPOSIT: "PAYMENT_WITHOUT_DEPOSIT",
 DEPOSIT_NOT_COMPLETED: "DEPOSIT_NOT_COMPLETED",
 DEPOSIT_NOT_ON_SPEED: "DEPOSIT_NOT_ON_SPEED",
 WITHDRAW_NOT_FOUND: "WITHDRAW_NOT_FOUND",
 WITHDRAW_REFUNDED_BUT_SENT: "WITHDRAW_REFUNDED_BUT_SENT",
 WITHDRAW_NOT_ON_SPEED: "WITHDRAW_NOT_ON_SPEED",
 AMOUNT_MISMATCH: "AMOUNT_MISMATCH",
 WITHDRAW_STUCK: "WITHDRAW_STUCK",
 UNKNOWN_SPEED_TRANSACTION: "UNKNOWN_SPEED_TRANSACTION",
 PLAYER_FUNDS_SHORT: "PLAYER_FUNDS_SHORT",
} as const;

export const ADMIN_RECORD_KIND = {
 DEPOSIT: "DEPOSIT",
 WITHDRAW: "WITHDRAW",
} as const;

export const ADMIN_LEDGER_DIRECTION = {
 CREDIT: "CREDIT",
 DEBIT: "DEBIT",
} as const;

export const ADMIN_LEDGER_BALANCE = {
 PLAYABLE: "PLAYABLE",
 WITHDRAWABLE: "WITHDRAWABLE",
} as const;

export const ADMIN_API_STATUS = {
 OTP_REQUIRED: "otp_required",
 DEVICE_PENDING: "device_pending",
 TOKEN_EXPIRED: "token_expired",
 UNAUTHORIZED: "unauthorized",
 INVALID_TOKEN: "invalid_token",
 SESSION_EXPIRED: "session_expired",
 ADMIN_RESTRICTED: "admin_restricted",
} as const;
