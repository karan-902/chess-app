import {
 ADMIN_ISSUE_STATUS,
 ADMIN_ISSUE_TYPE,
 ADMIN_RECORD_KIND,
} from "@gopvp/admin/src/constants/endpoint";
import {
 adminRoleText,
 amountMismatchText,
 depositNotCompletedText,
 depositNotOnSpeedText,
 depositText,
 financeText,
 openText,
 paymentWithoutDepositText,
 playerFundsShortText,
 resolvedText,
 speedCrossCheckText,
 superAdminText,
 supportText,
 unknownSpeedTransactionText,
 withdrawNotFoundText,
 withdrawNotOnSpeedText,
 withdrawRefundedButSentText,
 withdrawStuckText,
 withdrawText,
} from "@gopvp/admin/src/constants/message";

export const ADMIN_ROLE_LABELS: Record<string, string> = {
 SUPER_ADMIN: superAdminText,
 ADMIN: adminRoleText,
 FINANCE: financeText,
 SUPPORT: supportText,
};

export const SPEED_CHECK_TYPE_LABELS: Record<string, string> = {
 SPEED_CROSS_CHECK: speedCrossCheckText,
};

export const ISSUE_TYPE_LABELS: Record<string, string> = {
 [ADMIN_ISSUE_TYPE.PAYMENT_WITHOUT_DEPOSIT]: paymentWithoutDepositText,
 [ADMIN_ISSUE_TYPE.DEPOSIT_NOT_COMPLETED]: depositNotCompletedText,
 [ADMIN_ISSUE_TYPE.DEPOSIT_NOT_ON_SPEED]: depositNotOnSpeedText,
 [ADMIN_ISSUE_TYPE.WITHDRAW_NOT_FOUND]: withdrawNotFoundText,
 [ADMIN_ISSUE_TYPE.WITHDRAW_REFUNDED_BUT_SENT]: withdrawRefundedButSentText,
 [ADMIN_ISSUE_TYPE.WITHDRAW_NOT_ON_SPEED]: withdrawNotOnSpeedText,
 [ADMIN_ISSUE_TYPE.AMOUNT_MISMATCH]: amountMismatchText,
 [ADMIN_ISSUE_TYPE.WITHDRAW_STUCK]: withdrawStuckText,
 [ADMIN_ISSUE_TYPE.UNKNOWN_SPEED_TRANSACTION]: unknownSpeedTransactionText,
 [ADMIN_ISSUE_TYPE.PLAYER_FUNDS_SHORT]: playerFundsShortText,
};

export const ISSUE_STATUS_LABELS: Record<string, string> = {
 [ADMIN_ISSUE_STATUS.OPEN]: openText,
 [ADMIN_ISSUE_STATUS.RESOLVED]: resolvedText,
};

export const RECORD_KIND_LABELS: Record<string, string> = {
 [ADMIN_RECORD_KIND.DEPOSIT]: depositText,
 [ADMIN_RECORD_KIND.WITHDRAW]: withdrawText,
};
