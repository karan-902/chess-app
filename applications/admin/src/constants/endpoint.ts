export const ADMIN_ENDPOINTS = {
 LOGIN: "/admin/auth/login",
 VERIFY_OTP: "/admin/auth/verify-otp",
 GENERATE_TOKEN: "/admin/auth/generate-token",
 LOGOUT: "/admin/auth/logout",
} as const;

export const ADMIN_API_STATUS = {
 OTP_REQUIRED: "otp_required",
 DEVICE_PENDING: "device_pending",
 TOKEN_EXPIRED: "token_expired",
} as const;
