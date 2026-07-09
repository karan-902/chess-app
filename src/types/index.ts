// ── API body types ────────────────────────────────────────────────────────────

// POST /register
export type IRegisterEmailBody = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    country: string;
};

// POST /sso-register, /sso-login
export type ISSOBody = {
    signup_method: "google";
    google_token: string;
    redirect_uri: string;
};

// POST /login
export type ILoginBody = {
    email: string;
    password: string;
};

// POST /generate-token
export type IGenerateTokenBody = {
    refresh_token: string;
    source?: string;
};

// POST /verify-user
export type IVerifyUserBody = {
    email: string;
};

// POST /logout
export type ILogoutBody = {
    session_id: string;
};

// POST /forgot-password
export type IForgotPasswordBody = {
    email: string;
};

// POST /reset-password
export type IResetPasswordBody = {
    reset_token: string;
    new_password: string;
};
