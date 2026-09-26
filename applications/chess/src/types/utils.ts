export enum SignupMethod {
 EMAIL = "EMAIL",
 GOOGLE = "GOOGLE",
}

export enum SessionState {
 ACTIVE = "ACTIVE",
 INACTIVE = "INACTIVE",
 EXPIRED = "EXPIRED",
}

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export type IVerifyUserResponse = {
 email: string;
 username: string;
 signup_method: SignupMethod;
 is_verified: boolean;
};

export type IRandomNameResponse = {
 usernames: string[];
};

export type IRegisterResponse = {
 id: string;
 username: string;
 email: string;
 country: string;
 created: number;
 // first_name: string;
 // last_name: string;
 // signup_method: SignupMethod;
 // elo_rating: number | null;
 // current_streak: number;
 // best_streak: number;
 // skill_level: SkillLevel | null;
};

export type ILoginResponse = {
 id: string;
 session_id: string;
 username: string;
 email: string;
 country: string;
 session_state: SessionState;
 session_source: SignupMethod;
 is_verified: boolean;
 access_token: string;
 refresh_token: string;
 last_login: number | null;
 // ratings: IRatingsBreakdown;
 // current_streak: number;
 // best_streak: number;
 // skill_level: SkillLevel | null;
 // avatar_seed: string | null;
};

// export type IPendingApprovalResponse = {
//  status: "pending_approval";
//  approval_token: string;
// };

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
 | "WIN"
 | "DRAW"
 | "MATCH_CANCELLED";

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


export type IGameDetailsResponse = {
 id: string;
 slug: string;
 name: string;
 icon: string;
 description: string;
 is_active: boolean;
};

export type IGenerateTokenResponse = {
 access_token: string;
 refresh_token: string;
};

// export type ILogoutResponse = {
//  message: string;
// };

export type IMessageResponse = {
 message: string;
};
