// ── Enums ────────────────────────────────────────────────────────────────────

export enum SignupMethod {
    EMAIL = "email",
    GOOGLE = "google",
}

export enum SessionState {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    EXPIRED = "EXPIRED",
}

// ── API response types ────────────────────────────────────────────────────────

// POST /verify-user
export type IVerifyUserResponse = {
    email: string;
    signup_method: SignupMethod;
};

// POST /register
export type IRegisterResponse = {
    id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    country: string;
    signup_method: SignupMethod;
    created: number;
};

// POST /sso-register, /login, /sso-login
export type ILoginResponse = {
    id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    country: string;
    last_login: number | null;
    access_token: string;
    refresh_token: string;
    session_id: string;
    session_state: SessionState;
    session_source: SignupMethod;
};

// POST /generate-token
export type IGenerateTokenResponse = {
    access_token: string;
};

// POST /logout
export type ILogoutResponse = {
    message: string;
};

// POST /forgot-password, /reset-password
export type IMessageResponse = {
    message: string;
};
