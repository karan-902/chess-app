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
 total_balance: number;
 withdraw_balance: number;
};

export type WithdrawMethod = "lightning" | "bitcoin";

export type IWithdrawBody = {
 amount: number;
 destination: string;
};

export type IWithdrawResponse = IWalletBalanceResponse & {
 withdraw_id: string;
 amount: number;
 status: string;
 method: string;
 destination: string;
 created: number;
};

export type TransactionType =
 | "DEPOSIT"
 | "WITHDRAW"
 | "WITHDRAW_REFUND"
 | "BET"
 | "SETTLEMENT"
 | "DRAW"
 | "BET_REFUND";

export type ITransactionsFilterBody = {
 types?: TransactionType[];
 from?: number;
 to?: number;
};

export type ITransactionResponse = {
 id: string;
 transaction_type: TransactionType;
 amount: number;
 created: number;
};

export type ITransactionsResponse = {
 has_more: boolean;
 object: "list";
 data: ITransactionResponse[];
 page_id: string | null;
};

export type IInitiateDepositBody = {
 amount: number;
};

export type IInitiateDepositResponse = {
 deposit_id: string;
 amount: number;
 status: string;
 payment_request: string;
 expires_at: number;
 ttl: number;
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
