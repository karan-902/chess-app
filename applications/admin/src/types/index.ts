import type { ElementType } from "react";
import type { ADMIN_API_STATUS } from "@gopvp/admin/src/constants/endpoint";

export type TAdminNavItem = {
 label: string;
 icon: ElementType;
 path?: string;
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

export type TApiErrorBody = {
 errors?: { message: string; type?: string }[];
};
