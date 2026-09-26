import type { LeaderboardScope, LeaderboardSort } from "@gopvp/common/src/types/index";

/** auth */
export type IVerifyUserBody = {
 email: string;
};

export type IRegisterBody = {
 username: string;
 email: string;
 password: string;
 country: string;
};

export type ILoginBody = {
 email: string;
 password: string;
 fingerprint?: string;
};

export type IGoogleLoginBody = {
 code: string;
 redirect_uri: string;
 fingerprint?: string;
};

export type IGenerateTokenBody = {
 refresh_token: string;
};

/** wallet */
export type IInitiateDepositBody = {
 amount: number;
};

export type IWithdrawRequestBody = {
 amount: number;
 destination: string;
};

/** matchmaking */
export type ICreateRoomBody = {
 game: string;
 bet: number;
 time: number;
};

export type IJoinRoomBody = {
 room_code: string;
};

export type IJoinPoolBody = {
 game: string;
 bet: number;
 time: number;
};

/** profile */
export type IUpdateProfileBody = {
 username?: string;
 country?: string;
};

/** leaderboard */
export type ILeaderboardBody = {
 game: string;
 scope?: LeaderboardScope;
 sort?: LeaderboardSort;
 ending_before?: string;
};
