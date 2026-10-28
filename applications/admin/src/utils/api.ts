import axios, { isAxiosError, type Method } from "axios";
import { apiUrl } from "@gopvp/common/src/constants/env";
import {
 ADMIN_API_STATUS,
 ADMIN_ENDPOINTS,
} from "@gopvp/admin/src/constants/endpoint";
import { ROUTES } from "@gopvp/admin/src/constants/route";
import { somethingWentWrongText } from "@gopvp/admin/src/constants/message";
import {
 clearAdminSession,
 loadAdminSession,
} from "@gopvp/admin/src/utils/session";
import type { TApiErrorBody } from "@gopvp/admin/src/types";

let refreshPromise: Promise<string> | null = null;

const send = <TResponse, TPayload>(
 method: Method,
 path: string,
 data?: TPayload,
 accessToken?: string,
) =>
 axios
  .request<TResponse>({
   baseURL: apiUrl,
   method,
   url: path,
   data,
   headers: accessToken ? { Authorization: accessToken } : undefined,
   withCredentials: true,
  })
  .then((response) => response.data);

const refreshAccessToken = () => {
 (async () => {
  try {
   return await send("POST", ADMIN_ENDPOINTS.GENERATE_TOKEN);
  } finally {
   refreshPromise = null;
  }
 })();
};

export const getApiErrorMessage = (error: unknown) =>
 (isAxiosError<TApiErrorBody>(error) &&
  error.response?.data?.errors?.[0]?.message) ||
 somethingWentWrongText;

export const endAdminSession = () => {
 clearAdminSession();
 window.location.replace(ROUTES.LOGIN);
};

export async function adminApiCall<TResponse, TPayload = undefined>(
 method: Method,
 path: string,
 data?: TPayload,
): Promise<TResponse> {
 const session = loadAdminSession();
 try {
  return await send<TResponse, TPayload>(method, path, data);
 } catch (error) {
  const errorType =
   isAxiosError<TApiErrorBody>(error) &&
   error.response?.data?.errors?.[0]?.type;
  if (!session || errorType !== ADMIN_API_STATUS.TOKEN_EXPIRED) throw error;
  try {
   await refreshAccessToken();
   return await send<TResponse, TPayload>(method, path, data);
  } catch (refreshError) {
   endAdminSession();
   throw refreshError;
  }
 }
}
