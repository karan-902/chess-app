import type {
 MatchResult,
 SessionState,
 SignupMethod,
 TransactionCode,
 TransactionType,
} from "@gopvp/common/src/types/index";

export type IMessageResponse = {
 message: string;
};

export type ISocketAckError = {
 event: string;
 errors: { message: string; type: string }[];
};

export type IApiErrorResponse = {
 message?: string;
 type?: string;
 errors?: { message: string; type: string }[];
};

export type IApiErrorInfo = IApiErrorResponse & {
 status: number;
 isNetworkError: boolean;
};

export type IListResponse<T> = {
 has_more: boolean;
 object: "list";
 data: T[] | null;
 page_id: string | null;
};

export type IVerifyUserResponse = {
 email: string;
 username: string;
 signup_method: SignupMethod;
 is_verified: boolean;
};

export type IRegisterResponse = {
 id: string;
 username: string;
 email: string;
 country: string;
 created: number;
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
 last_login: number;
};

export type IGenerateTokenResponse = {
 access_token: string;
 refresh_token: string;
};

export type IFirebaseTokenResponse = {
 token: string;
};

export type IRandomNameResponse = {
 usernames: string[];
};

export type ICountriesResponse = {
 countries: { code: string; name: string }[];
};

export type IGameResponse = {
 id: string;
 slug: string;
 name: string;
 icon: string;
 description: string;
 is_active: boolean;
};

export type IBalanceResponse = {
 total_balance: number;
 withdraw_balance: number;
};

export type ITransactionResponse = {
 id: string;
 transaction_type: TransactionType;
 transaction_code: TransactionCode;
 amount: number;
 created: number;
};

export type IPaymentRequestResponse = {
 deposit_id: string;
 amount: number;
 status: "PENDING";
 payment_request: string;
 expires_at: number;
 ttl: number;
};

export type IWithdrawResponse = IBalanceResponse & {
 withdraw_id: string;
 amount: number;
 status: "PROCESSING" | "COMPLETED";
 method: "lightning";
 destination: string;
 created: number;
};

export type ITransactionCompletedEvent = {
 type: "DEPOSIT" | "WITHDRAW";
 amount: number;
};

export type IPoolResponse = {
 id: string;
 bet: number;
 prize: number;
 time: number;
 players: number;
 active: number;
 hot: boolean;
};

export type IMatchPlayer = {
 id: string;
 username: string;
};

export type ICreateRoomResponse = {
 room_code: string;
 bet: number;
 time: number;
 expiry: number;
};

export type IMatchmakingResponse =
 | { status: "WAITING" }
 | {
    status: "MATCHED";
    match_type: "POOL";
    match_id: string;
    players: IMatchPlayer[];
    first_move_deadline_ms: number;
   }
 | {
    status: "MATCHED";
    match_type: "ROOM";
    room_code: string;
    players: IMatchPlayer[];
    bet: number;
    time: number;
    expiry: number;
   };

export type IStartMatchResponse =
 | { status: "WAITING" }
 | {
    status: "MATCHED";
    match_id: string;
    players: IMatchPlayer[];
    first_move_deadline_ms: number;
   };

export type IPoolMatchedEvent = {
 matchId: string;
 firstMoveDeadlineMs: number;
};

export type IRoomMatchedEvent = {
 matchType: "ROOM";
 roomCode: string;
 players: IMatchPlayer[];
 bet: number;
 time: number;
};

export type IMatchStartedEvent = {
 matchId: string;
 players: IMatchPlayer[];
 firstMoveDeadlineMs: number;
};

export type IRoomLeftEvent = {
 roomCode: string;
 status: "WAITING";
};

export type IMatchGame = {
 name: string;
 slug: string;
 icon: string;
};

export type IMatchOutcome = {
 result: MatchResult;
 amount: number;
};

export type IMatchPlayerResponse = {
 username: string;
 score: number;
};

export type IMatchInfoResponse = IMatchOutcome & {
 id: string;
 game: IMatchGame;
 you: IMatchPlayerResponse;
 opponent: IMatchPlayerResponse;
 created: number;
};

export type IWorldMatchInfoResponse = {
 id: string;
 game: IMatchGame;
 amount: number;
 winner: IMatchPlayerResponse;
 loser: IMatchPlayerResponse;
 created: number;
};

export type IMatchResultResponse = IMatchOutcome & {
 id: string;
 end_reason: string | null;
 score_change: number;
};

export type IMatchHistoryResponse = IMatchOutcome & {
 id: string;
 game: IMatchGame;
 opponent: string;
 end_reason: string | null;
 time: number;
 bet: number;
 created: number;
};

export type IWorldMatchHistoryResponse = {
 id: string;
 game: IMatchGame;
 winner: string;
 loser: string;
 amount: number;
 created: number;
};

export type IMatchHistoryItem =
 IMatchHistoryResponse | IWorldMatchHistoryResponse;

export type IGameNotFoundResponse = {
 error: "not_found";
};


export type IPoolUpdatedEvent = {
 game: string;
 stats: { games: number; players: number };
 pools: IPoolResponse[];
};

export type IGameStateBasePlayer = {
 user_id: string;
 username: string;
 score: number;
};

export type IActiveGameResponse = {
 match_id: string;
 game_slug: string;
 bet: number;
 opponent: IGameStateBasePlayer;
};

export type IGameStateBaseResponse = {
 match_id: string;
 game_slug: string;
 bet: number;
 players: IGameStateBasePlayer[];
};

export type IDrawOfferEvent = {
 offererId: string;
};

export type IDrawDeclineEvent = {
 declinerId: string;
};

export type IDrawDeclineResponse = {
 declined: true;
};

export type IResignEvent = {
 resignerId: string;
};

export type IRejoinDeclinedEvent = {
 declinedUserId: string;
};

export type IDisconnectEvent = {
 disconnectedUserId: string;
};

export type IOpponentStatusEvent = {
 userId: string;
};

export type IEndUpdateEvent = {
 score: number;
};

export type IProfileResponse = {
 id: string;
 username: string;
 email: string;
 country: string;
 signup_method: SignupMethod;
 is_verified: boolean;
 created: number;
};

export type ILeaderboardEarningsResponse = {
 id: string;
 username: string;
 win_amount: number;
};

export type ILeaderboardWinsResponse = {
 id: string;
 username: string;
 wins: number;
};

export type ILeaderboardRowResponse =
 ILeaderboardEarningsResponse | ILeaderboardWinsResponse;

export type ILeaderboardPlayerResponse = {
 username: string;
 score: number;
 current_streak: number;
 best_streak: number;
 gross_income: number;
 wins: number;
};

export type ILiveWinsDocResponse = {
 matches: IWorldMatchHistoryResponse[];
 updated: number;
};
