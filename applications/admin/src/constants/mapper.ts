import {
 ADMIN_API_STATUS,
 ADMIN_ISSUE_STATUS,
 ADMIN_ISSUE_TYPE,
 ADMIN_RECORD_KIND,
} from "@gopvp/admin/src/constants/endpoint";

export const ADMIN_MONEY_ROLES = new Set(["SUPER_ADMIN", "FINANCE"]);

export const ADMIN_SESSION_END_TYPES = new Set<string>([
 ADMIN_API_STATUS.UNAUTHORIZED,
 ADMIN_API_STATUS.INVALID_TOKEN,
 ADMIN_API_STATUS.SESSION_EXPIRED,
 ADMIN_API_STATUS.ADMIN_RESTRICTED,
]);

export const ISSUE_STATUS_TONES: Record<string, string> = {
 [ADMIN_ISSUE_STATUS.OPEN]: "amber",
 [ADMIN_ISSUE_STATUS.RESOLVED]: "green",
};

export const RECORD_STATUS_TONES: Record<string, string> = {
 COMPLETED: "green",
 FAILED: "red",
 EXPIRED: "red",
 CANCELLED: "red",
 REVIEW: "amber",
};

export const RECORD_STATUS_STAGES: Record<string, string> = {
 PENDING: "open",
 PROCESSING: "open",
 REVIEW: "open",
 COMPLETED: "done",
 FAILED: "closed",
 EXPIRED: "closed",
 CANCELLED: "closed",
};

export const SPEED_STATUS_STAGES: Record<string, string> = {
 unpaid: "open",
 pending: "open",
 processing: "open",
 paid: "done",
 failed: "closed",
 expired: "closed",
 cancelled: "closed",
};

export const SPEED_CHECK_SOURCE_KINDS: Record<string, string> = {
 [ADMIN_ISSUE_TYPE.PAYMENT_WITHOUT_DEPOSIT]: ADMIN_RECORD_KIND.DEPOSIT,
 [ADMIN_ISSUE_TYPE.WITHDRAW_NOT_FOUND]: ADMIN_RECORD_KIND.WITHDRAW,
};

export const ADJUST_USER_REQUIRED_ISSUE_TYPES = new Set<string>([
 ADMIN_ISSUE_TYPE.PAYMENT_WITHOUT_DEPOSIT,
]);
