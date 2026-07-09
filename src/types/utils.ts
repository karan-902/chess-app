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
    username: string;
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
    username: string;
    email: string;
    country: string;
    elo_rating: number;
    last_login: number | null;
    access_token: string;
    refresh_token: string;
    session_id: string;
    session_state: SessionState;
    session_source: SignupMethod;
};

// GET /profile
export type IProfileResponse = {
    id:         string;
    first_name: string;
    last_name:  string;
    username:   string;   // backend returns "username" (not "user_name")
    email:      string;
    country:    string;
    elo_rating: number;
    last_login: number | null;
};

// PUT /profile
export type IUpdateProfileBody = {
    first_name?: string;
    last_name?:  string;
    username?:   string;   // note: backend field is "username" not "user_name"
    country?:    string;
    // elo_rating is intentionally excluded — not updatable via this endpoint
};

export type IUpdateProfileResponse = IProfileResponse;

// GET /game/:game_id
export type IGameRestoreResponse = {
    game_id:      string;
    status:       "ONGOING" | "COMPLETED" | "ABANDONED";
    time_seconds: number;
    current_fen:  string;
    turn_user_id: string;
    white_player: { id: string; username: string; elo_rating: number };
    black_player: { id: string; username: string; elo_rating: number };
    moves: Array<{
        from:        string;
        to:          string;
        promotion:   string | null;
        fen:         string;
        player_id:   string;
        move_number: number;
    }>;
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
