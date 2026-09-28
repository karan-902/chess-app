import axios, {
 AxiosHeaders,
 isAxiosError,
 type AxiosRequestConfig,
 type Method,
} from "axios";
import sessionService from "@gopvp/common/src/util/sessionService";
import { showToastMessage } from "@gopvp/common/src/util/injectStore";
import { readStorage, writeStorage } from "@gopvp/common/src/util/storage";
import { apiUrl } from "@gopvp/common/src/constants/env";
import { somethingWentWrongText } from "@gopvp/common/src/constants/message";
import type { IGenerateTokenBody } from "@gopvp/common/src/types/payload";
import type {
 IApiErrorResponse,
 IGenerateTokenResponse,
 ILoginResponse,
 ISocketAckError,
} from "@gopvp/common/src/types/response";
import {
 ENDPOINTS,
 OPEN_ENDPOINTS,
} from "@gopvp/common/src/constants/endpoint";
import { FINGERPRINT_STORAGE_KEY } from "@gopvp/common/src/constants/storageKey";

let fingerprintPromise: Promise<string> | null = null;

export function getDeviceFingerprint(): Promise<string> {
 const stored = readStorage(localStorage, FINGERPRINT_STORAGE_KEY);
 if (stored) return Promise.resolve(stored);

 if (!fingerprintPromise) {
  fingerprintPromise = (async () => {
   try {
    const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
    const agent = await FingerprintJS.load();
    const { visitorId } = await agent.get();
    if (visitorId)
     writeStorage(localStorage, FINGERPRINT_STORAGE_KEY, visitorId);
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
   >("POST", ENDPOINTS.GENERATE_TOKEN, {
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

export function getApiErrorResponse(err: unknown) {
 return isAxiosError<IApiErrorResponse>(err) ? err.response : undefined;
}

export function showApiErrorToast(err: unknown) {
 const response = getApiErrorResponse(err);
 const isAlreadyToasted =
  !response ||
  response.status === 429 ||
  response.data?.type === "session_expired";
 const toastMessage = response?.data?.message;
 if (isAlreadyToasted || !toastMessage) return;
 showToastMessage({ toastMessage, toastVariant: "error" });
}

export function showAckErrorToast(err: ISocketAckError | null) {
 const toastMessage = err?.errors[0]?.message;
 if (!toastMessage) return;
 showToastMessage({ toastMessage, toastVariant: "error" });
}

async function getHeaders<TPayload = undefined>(
 method: Method,
 path: string,
 data?: TPayload,
): Promise<AxiosRequestConfig> {
 const isOpen = OPEN_ENDPOINTS.includes(path);
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

export const callAPIInterface = async <
 TResponse = unknown,
 TPayload = undefined,
>(
 method: Method,
 path: string,
 data?: TPayload,
): Promise<TResponse> => {
 const config = await getHeaders(method, path, data);
 try {
  const res = await axios(config);
  return res.data;
 } catch (err) {
  console.error(err);
  const response = getApiErrorResponse(err);
  const firstError = response?.data?.errors?.[0];
  if (response && firstError) {
   response.data = { ...response.data, ...firstError };
  }
  const errorData = response?.data;
  const errorType = errorData?.type;

  if (path === ENDPOINTS.LOGOUT) throw err;

  if (!response) {
   showToastMessage({
    toastMessage: somethingWentWrongText,
    toastVariant: "error",
   });
   throw err;
  }

  if (errorType === "token_expired") {
   try {
    const accessToken = await generateToken();
    const retryRes = await axios({
     ...config,
     headers: {
      ...(config.headers as Record<string, string>),
      Authorization: accessToken,
     },
    });
    return retryRes.data;
   } catch (tokenErr) {
    await sessionService.deleteSession();
    throw tokenErr;
   }
  }

  if (errorType === "session_expired") {
   if (errorData?.message) {
    showToastMessage({
     toastMessage: errorData.message,
     toastVariant: "error",
    });
   }
   await sessionService.deleteSession();
   throw err;
  }

  if (response.status === 429 && errorData?.message) {
   showToastMessage({
    toastMessage: errorData.message,
    toastVariant: "error",
   });
  }

  throw err;
 }
};
