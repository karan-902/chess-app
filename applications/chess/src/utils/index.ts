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
import {
 somethingWentWrongText,
 yesterdayText,
 justNowText,
} from "@/constants/messages";
import type { IGenerateTokenBody } from "@gopvp/common/src/types/payload";
import type {
 IGenerateTokenResponse,
 ILoginResponse,
 ISocketAckError,
} from "@gopvp/common/src/types/response";
import { GAMES, GAME_PAGES, type GameSlug } from "@/constants/config";
import { apiUrl } from "@gopvp/common/src/constants/env";
import type { GameCategory } from "@/types/index";
import { getStoredFingerprint, setStoredFingerprint } from "@/utils/storage";

dayjs.extend(duration);
const OPEN_API_ENDPOINTS = [
 "/auth/register",
 "/auth/login",
 "/auth/sso-login",
 "/auth/generate-token",
 "/auth/verify-user",
 // "/auth/sso-register",
 // "/device/approval-status",
];
export const LOGOUT_PATH = "/auth/logout";

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
    IGenerateTokenResponse,
    IGenerateTokenBody
   >("POST", "/auth/generate-token", {
    refresh_token: session?.refresh_token ?? "",
   });
   if (session) {
    await sessionService.saveSession({
     ...session,
     access_token,
     refresh_token,
    });
   }
   return access_token;
  } finally {
   refreshPromise = null;
  }
 })();

 return refreshPromise;
}

export function showApiErrorToast(err: any) {
 const response = err?.response;
 const isAlreadyToasted =
  !response ||
  response.status === 429 ||
  response.data?.type === "session_expired";
 const toastMessage = response?.data?.message;
 if (isAlreadyToasted || !toastMessage) return;
 store.dispatch(
  showToast({ isToastOpen: true, toastMessage, toastVariant: "error" }),
 );
}

export function showAckErrorToast(err: ISocketAckError | null) {
 const toastMessage = err?.errors[0]?.message;
 if (!toastMessage) return;
 store.dispatch(
  showToast({ isToastOpen: true, toastMessage, toastVariant: "error" }),
 );
}

async function getHeaders<TPayload = undefined>(
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
  baseURL: apiUrl,
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
 return Object.fromEntries(
  Object.entries(GAME_PAGES).map(([key, page]) => [key, `/${game}/${page}`]),
 ) as Record<keyof typeof GAME_PAGES, string>;
}

export function buildMatchUrl(game: GameSlug, matchId: string): string {
 return `${getGameRoutes(game).PLAY}?match=${matchId}`;
}
export function formatMatchDate(ms: number): string {
 const now = dayjs();
 const then = dayjs(ms);
 if (!then.isSame(now, "day")) {
  if (then.isSame(now.subtract(1, "day"), "day")) return yesterdayText;
  return then.format("MMMM D, YYYY");
 }
 const diffSeconds = now.diff(then, "second");
 if (diffSeconds < 60) return justNowText;
 const minutes = now.diff(then, "minute");
 if (minutes < 60) return `${minutes}m ago`;
 return `${now.diff(then, "hour")}h ago`;
}

export function formatMMSS(totalSeconds: number): string {
 return dayjs.duration(Math.max(0, totalSeconds), "seconds").format("m:ss");
}

export const callAPIInterface = async <
 TResponse = unknown,
 TPayload = undefined,
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
      toastMessage: somethingWentWrongText,
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
      showToast({
       isToastOpen: true,
       toastMessage: errorData.message,
       toastVariant: "error",
      }),
     );
    }
    await sessionService.deleteSession();
    reject(err);
    return;
   }

   if (errorStatus === 429 && errorData?.message) {
    store.dispatch(
     showToast({
      isToastOpen: true,
      toastMessage: errorData.message,
      toastVariant: "error",
     }),
    );
   }

   reject(err);
  }
 });
};
