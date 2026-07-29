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

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

// ── API response types ────────────────────────────────────────────────────────

// POST /verify-user
export type IVerifyUserResponse = {
    email: string;
    signup_method: SignupMethod;
    email_verified: boolean;
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
    elo_rating: number | null; // null until skill level selected
    current_streak: number;
    best_streak: number;
    skill_level: SkillLevel | null;
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
    elo_rating: number | null; // null until skill level selected
    ratings: IRatingsBreakdown;
    current_streak: number;
    best_streak: number;
    skill_level: SkillLevel | null;
    last_login: number | null;
    avatar_seed: string | null;
    access_token: string;
    refresh_token: string;
    session_id: string;
    session_state: SessionState;
    session_source: SignupMethod;
};

export type IRatingsBreakdown = {
    bullet: number | null;
    blitz: number | null;
    rapid: number | null;
    classical: number | null;
};

// GET /profile
export type IProfileResponse = {
    id: string;
    first_name: string;
    last_name: string;
    username: string; // backend returns "username" (not "user_name")
    email: string;
    country: string;
    // Rapid rating — kept for compact displays (AppBar badge, etc.); see
    // `ratings` for the full per-category (bullet/blitz/rapid/classical)
    // breakdown. Both null until skill level selected.
    elo_rating: number | null;
    ratings: IRatingsBreakdown;
    skill_level: SkillLevel | null;
    current_streak: number;
    best_streak: number;
    last_login: number | null;
    avatar_seed: string | null;
};

// PUT /profile
export type IUpdateProfileBody = {
    first_name?: string;
    last_name?: string;
    username?: string; // note: backend field is "username" not "user_name"
    country?: string;
    avatar_seed?: string;
    // elo_rating is intentionally excluded — not updatable via this endpoint
};

export type IUpdateProfileResponse = IProfileResponse;

// POST /deposit (Speed API)
export type ICreatePaymentResponse = Record<string, unknown>;

// GET /wallet
export type IWalletBalanceResponse = {
    balance_usd: number;
    deposit_usd: number;
    win_usd: number;
    withdrawable_usd: number;
    pending_withdrawal_usd: number;
};

// POST /wallet/withdraw
export type WithdrawMethod = "lightning" | "onchain";

export type IWithdrawBody = {
    amount_usd: number;
    withdraw_method: WithdrawMethod;
    destination: string;
};

export type IWithdrawResponse = IWalletBalanceResponse & {
    status: string;
};

export type TransactionType =
    | "DEPOSIT"
    | "WITHDRAW"
    | "WITHDRAW_REFUND"
    | "STAKE_ESCROW"
    | "PAYOUT"
    | "DRAW_REFUND"
    | "ESCROW_REFUND";

// GET /wallet/transactions
export type ITransactionResponse = {
    id: string;
    type: TransactionType;
    amount_usd: number;
    game_id: string | null;
    description: string;
    created: number;
    withdraw_status: string | null;
};

export type ITransactionsResponse = {
    has_more: boolean;
    object: "list";
    data: ITransactionResponse[];
    page_id: string | null;
};

// GET /wallet/stats
export type IWalletStatsResponse = {
    deposited_usd: number;
    withdrawn_usd: number;
    net_payouts_usd: number;
};

// POST /deposit
export type IInitiateDepositBody = {
    amount_usd: number;
};

export type IInitiateDepositResponse = {
    payment_id: string;
    bitcoin_address: string | null;
    lightning_payment_request: string | null;
    expires_at: number | null;
    amount_usd: number;
    status: "PENDING";
};

// GET /profile/avatar-options
export type IAvatarOptionsResponse = {
    style: string;
    seeds: string[];
};

// POST /profile/skill-level
export type ISetSkillLevelBody = {
    skill_level: SkillLevel;
};

export type ISetSkillLevelResponse = {
    skill_level: SkillLevel;
    elo_rating: number;
};

// GET /game/:game_id
export type IGameRestoreResponse = {
    game_id: string;
    status: "ONGOING" | "COMPLETED" | "ABANDONED";
    time_seconds: number;
    current_fen: string;
    turn_user_id: string;
    white_player: {
        id: string;
        username: string;
        elo_rating: number;
        avatar_seed: string | null;
    };
    black_player: {
        id: string;
        username: string;
        elo_rating: number;
        avatar_seed: string | null;
    };
    moves: Array<{
        from: string;
        to: string;
        promotion: string | null;
        fen: string;
        player_id: string;
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
