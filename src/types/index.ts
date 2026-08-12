export type IRegisterEmailBody = {
    username: string;
    email: string;
    password: string;
    country: string;
};

export type ISSOBody = {
    signup_method: "google";
    google_token: string;
    redirect_uri: string;
    confirm_device_switch?: boolean;
};

export type ILoginBody = {
    email: string;
    password: string;
};

export type IGenerateTokenBody = {
    refresh_token: string;
    source?: string;
};

export type IVerifyUserBody = {
    email: string;
};

export type ILogoutBody = {
    session_id: string;
};

export type IForgotPasswordBody = {
    email: string;
};

export type IResetPasswordBody = {
    reset_token: string;
    new_password: string;
};

export type IVerifyEmailBody = {
    email: string;
    otp: string;
};

export type IResendOtpBody = {
    email: string;
};
