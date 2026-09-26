import axios, {
 AxiosHeaders,
 type AxiosRequestConfig,
 type Method,
} from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { store } from "@/redux/index";
import { showToast } from "@/redux/common/slice";
import sessionService from "@gopvp/common/src/util/sessionService";
import { apiRateLimited, apiSomethingWentWrong } from "@/constants/messages";
import type { IGenerateTokenBody } from "@/types/index";
import type { IGenerateTokenResponse, ILoginResponse } from "@/types/utils";
import { IGameRoomNavPayload, TimeControl } from "@/types/components";
import { TIME_SECONDS } from "@/constants";
import { GAMES, GAME_PAGES, type GameSlug } from "@/constants/config";
import type { GameCategory, IPoolResponse } from "@/types/types";
import { getStoredFingerprint, setStoredFingerprint } from "@/utils/storage";

dayjs.extend(duration);
const OPEN_API_ENDPOINTS = [
 "/auth/register",
 "/auth/login",
 "/auth/sso-login",
 "/auth/generate-token",
 "/auth/verify-user",
 // "/auth/sso-register",
 // "/forgot-password",
 // "/reset-password",
 // "/device/approval-status",
];
export const LOGOUT_PATH = "/auth/logout";
const errorStatusCodes = [400, 401, 403, 404, 409, 422, 429];
const serverErrorStatusCodes = [500, 502, 503, 504];

let fingerprintPromise: Promise<string> | null = null;

export function getDeviceFingerprint(): Promise<string> {
 const stored = getStoredFingerprint();
 if (stored) return Promise.resolve(stored);

 if (!fingerprintPromise) {
  fingerprintPromise = (async () => {
   try {
    const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
    const agent = await FingerprintJS.load();
    const { visitorId } = await agent.get();
    if (visitorId) setStoredFingerprint(visitorId);
    return visitorId;
   } catch {
    return "";
   }
  })();
 }
 return fingerprintPromise;
}

let refreshPromise: Promise<string> | null = null;

export async function generateToken(): Promise<string> {
 if (refreshPromise) return refreshPromise;

 refreshPromise = (async () => {
  try {
   const session = await sessionService.loadSession<ILoginResponse>();
   const { access_token, refresh_token } = await callAPIInterface<
    IGenerateTokenBody,
    IGenerateTokenResponse
   >("POST", "/auth/generate-token", {
    refresh_token: session?.refresh_token ?? "",
   });
   if (session) {
    await sessionService.saveSession({ ...session, access_token, refresh_token });
   }
   return access_token;
  } finally {
   refreshPromise = null;
  }
 })();

 return refreshPromise;
}

export function showApiErrorToast(err: any, fallbackMessage: string) {
 const response = err?.response;
 const isAlreadyToasted =
  !response ||
  response.status === 429 ||
  response.data?.type === "session_expired";
 if (isAlreadyToasted) return;
 store.dispatch(
  showToast({
   isToastOpen: true,
   toastMessage: response.data?.message ?? fallbackMessage,
   toastVariant: "error",
  }),
 );
}

export async function getHeaders<TPayload = undefined>(
 method: Method,
 path: string,
 data?: TPayload,
): Promise<AxiosRequestConfig> {
 const isOpen = OPEN_API_ENDPOINTS.includes(path);
 const headers = new AxiosHeaders();

 const session = await sessionService.loadSession<ILoginResponse>();

 if (method !== "GET") headers.set("Content-Type", "application/json");
 if (!isOpen && session?.access_token) {
  headers.set("Authorization", session.access_token);
 }

 return {
  baseURL: (import.meta.env.VITE_API_URL ?? "http://localhost:6060").trim(),
  method,
  url: path,
  data,
  headers,
 };
}

export function shortenUsername(username: string): string {
 const trimmed = username?.trim() ?? "";
 if (/[0-9_-]/.test(trimmed)) return trimmed;
 return trimmed.split(/\s+/)[0] ?? trimmed;
}

export function secondsToTimeControl(seconds: number): TimeControl {
 const match = (Object.entries(TIME_SECONDS) as [TimeControl, number][]).find(
  ([, s]) => s === seconds,
 );
 return match?.[0] ?? "rapid";
}
export function oppositeSide(side: "w" | "b"): "w" | "b" {
 return side === "w" ? "b" : "w";
}
export function msToSeconds(ms: number): number {
 return ms / 1000;
}
export function deriveCategory(timeSeconds: number): GameCategory {
 if (timeSeconds <= 120) return "BULLET";
 if (timeSeconds <= 420) return "BLITZ";
 if (timeSeconds <= 1200) return "RAPID";
 return "CLASSICAL";
}
export function isGameSlug(value: string | undefined): value is GameSlug {
 return !!value && Object.prototype.hasOwnProperty.call(GAMES, value);
}

export function getGameFromPath(pathname: string): GameSlug | null {
 const segment = pathname.split("/")[1];
 return isGameSlug(segment) ? segment : null;
}

export function isGamePlayPath(pathname: string): boolean {
 const game = getGameFromPath(pathname);
 return !!game && pathname === getGameRoutes(game).PLAY;
}

export function getGameRoutes(game: GameSlug) {
 return {
  PLAY: `/${game}/${GAME_PAGES.PLAY}`,
  MATCHES: `/${game}/${GAME_PAGES.MATCHES}`,
  LEADERBOARD: `/${game}/${GAME_PAGES.LEADERBOARD}`,
  RULES: `/${game}/${GAME_PAGES.RULES}`,
 };
}

export function buildGameRoomUrl(data: IGameRoomNavPayload, game: GameSlug): string {
 return (
  `${getGameRoutes(game).PLAY}?mode=pvp&time=${secondsToTimeControl(data.time_seconds)}` +
  `&game_id=${data.game_id}&color=${data.your_color}` +
  `&opponent=${encodeURIComponent(data.opponent.username)}` +
  `&opp_rating=${data.opponent.elo_rating}&opp_id=${data.opponent.id}` +
  `&opp_avatar_seed=${encodeURIComponent(data.opponent.avatar_seed ?? "")}` +
  `&stake_amount=${data.stake_amount}` +
  (data.room_code ? "&room=1" : "")
 );
}
export function buildMatchUrl(
 game: GameSlug,
 matchId: string,
 pool: Pick<IPoolResponse, "bet" | "time">,
): string {
 return (
  `${getGameRoutes(game).PLAY}?mode=pvp&game_id=${matchId}` +
  `&time=${secondsToTimeControl(msToSeconds(pool.time))}&stake_amount=${pool.bet}`
 );
}
export function formatMatchDate(ms: number): string {
 const now = dayjs();
 const then = dayjs(ms);
 if (!then.isSame(now, "day")) {
  if (then.isSame(now.subtract(1, "day"), "day")) return "Yesterday";
  return then.format("MMMM D, YYYY");
 }
 const diffSeconds = now.diff(then, "second");
 if (diffSeconds < 60) return "just now";
 const minutes = now.diff(then, "minute");
 if (minutes < 60) return `${minutes}m ago`;
 return `${now.diff(then, "hour")}h ago`;
}

export function formatMMSS(totalSeconds: number): string {
 return dayjs.duration(Math.max(0, totalSeconds), "seconds").format("m:ss");
}

export const callAPIInterface = async <
 TPayload = undefined,
 TResponse = unknown,
>(
 method: Method,
 path: string,
 data?: TPayload,
): Promise<TResponse> => {
 return new Promise(async (resolve, reject) => {
  const config = await getHeaders(method, path, data);
  if (!Object.keys(config).length) {
   reject({});
   return;
  }

  try {
   const res = await axios(config);
   resolve(res.data);
  } catch (err: any) {
   if (err.response?.data?.errors?.[0]) {
    err.response.data = {
     ...err.response.data,
     ...err.response.data.errors[0],
    };
   }
   const errorData = err.response?.data;
   const errorType = errorData?.type;
   const errorStatus = err.response?.status;
   console.error(err);
   console.error("API Error:", err.response || err);

   if (path === LOGOUT_PATH) {
    reject(err);
    return;
   }

   if (!err.response) {
    store.dispatch(
     showToast({
      isToastOpen: true,
      toastMessage: apiSomethingWentWrong,
      toastVariant: "error",
     }),
    );
    reject(err);
    return;
   }

   if (errorType === "token_expired") {
    try {
     const access_token = await generateToken();
     const retryConfig: AxiosRequestConfig = {
      ...config,
      headers: {
       ...(config.headers as Record<string, string>),
       Authorization: access_token,
      },
     };
     const retryRes = await axios(retryConfig);
     resolve(retryRes.data);
    } catch (tokenErr) {
     await sessionService.deleteSession();
     reject(tokenErr);
    }
    return;
   }

   if (errorType === "session_expired") {
    if (errorData?.message) {
     store.dispatch(
      showToast({ isToastOpen: true, toastMessage: errorData.message, toastVariant: "error" }),
     );
    }
    await sessionService.deleteSession();
    reject(err);
    return;
   }

   if (errorStatus === 429) {
    store.dispatch(showToast({ isToastOpen: true, toastMessage: apiRateLimited, toastVariant: "error" }));
   }

   const isKnownError =
    errorStatusCodes.includes(errorStatus) ||
    serverErrorStatusCodes.includes(errorStatus);

   if (isKnownError) {
    console.error(errorData?.message || err.message);
   }

   reject(err);
  }
 });
};
