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

export type IVerifyUserResponse = {
    email: string;
    signup_method: SignupMethod;
    is_verified: boolean;
};

export type IUsernameAvailableResponse = {
    available: boolean;
};

export type IRegisterResponse = {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    country: string;
    signup_method: SignupMethod;
    elo_rating: number | null;
    current_streak: number;
    best_streak: number;
    skill_level: SkillLevel | null;
    created: number;
};

export type ILoginResponse = {
    id: string;
    username: string;
    email: string;
    country: string;
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

export type IPendingApprovalResponse = {
    status: "pending_approval";
    approval_token: string;
};

export type IRatingsBreakdown = {
    BULLET: number | null;
    BLITZ: number | null;
    RAPID: number | null;
    CLASSICAL: number | null;
};

export type IProfileResponse = {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    country: string;

    elo_rating: number | null;
    ratings: IRatingsBreakdown;
    skill_level: SkillLevel | null;
    current_streak: number;
    best_streak: number;
    last_login: number | null;
    avatar_seed: string | null;
};

export type IUpdateProfileBody = {
    first_name?: string;
    last_name?: string;
    username?: string;
    country?: string;
    avatar_seed?: string;
};

export type IUpdateProfileResponse = IProfileResponse;

export type IWalletBalanceResponse = {
    balance_usd: number;
    withdrawable_usd: number;
};

export type WithdrawMethod = "lightning" | "bitcoin";

export type IWithdrawBody = {
    amount_usd: number;
    withdraw_method: WithdrawMethod;
    destination: string;
    password: string;
};

export type IWithdrawResponse = IWalletBalanceResponse & {
    status: string;
};

export type TransactionType =
    | "DEPOSIT"
    | "WITHDRAW"
    | "WITHDRAW_REFUND"
    | "STAKE"
    | "SETTLEMENT"
    | "DRAW_REFUND"
    | "STAKE_REFUND";

export type ITransactionsFilterBody = {
    types?: TransactionType[];
    from?: number;
    to?: number;
};

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

export type IAvatarOptionsResponse = {
    style: string;
    seeds: string[];
};

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

export type IGenerateTokenResponse = {
    access_token: string;
};

export type ILogoutResponse = {
    message: string;
};

export type IMessageResponse = {
    message: string;
};
