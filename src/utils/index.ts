import axios, {
    AxiosHeaders,
    type AxiosRequestConfig,
    type Method,
} from "axios";
import sessionService from "@/store/sessionService";
import type { IGenerateTokenBody } from "@/types/index";
import type { IGenerateTokenResponse } from "@/types/utils";

const OPEN_API_ENDPOINTS = [
    "/register",
    "/login",
    "/sso-register",
    "/sso-login",
    "/generate-token",
    "/verify-user",
    "/forgot-password",
    "/reset-password",
];
const errorStatusCodes = [400, 401, 403, 404, 409, 422, 429];
const serverErrorStatusCodes = [500, 502, 503, 504];

let refreshPromise: Promise<string> | null = null;

export async function generateToken(
    source = "api_interceptor",
): Promise<string> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        const session = await sessionService.loadSession();
        const { access_token } = await callAPIInterface<
            IGenerateTokenBody,
            IGenerateTokenResponse
        >("POST", "/generate-token", {
            refresh_token: session?.refresh_token ?? "",
            source,
        });
        if (session) {
            await sessionService.saveSession({ ...session, access_token });
        }
        return access_token;
    })().finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
}

export async function getHeaders<TPayload = undefined>(
    method: Method,
    path: string,
    data?: TPayload,
): Promise<AxiosRequestConfig> {
    const isOpen = OPEN_API_ENDPOINTS.includes(path);
    const headers = new AxiosHeaders();
    const session = await sessionService.loadSession();

    if (method !== "GET") headers.set("Content-Type", "application/json");
    if (!isOpen && session?.access_token) {
        headers.set("Authorization", session.access_token);
    }

    return {
        baseURL: (import.meta.env.VITE_API_URL ?? "http://localhost:3000").trim(),
        method,
        url: path,
        data,
        headers,
    };
}

/** Returns username if set, otherwise "First Last" */
export function getDisplayName(
    user:
        | { username?: string; first_name?: string; last_name?: string }
        | null
        | undefined,
): string {
    const name = user?.username?.trim();
    if (name) return name;
    return (
        `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "Unknown"
    );
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
            const errorData = err.response?.data;
            const errorType = errorData?.type;
            const errorStatus = err.response?.status;
            console.error(err);
            console.error("API Error:", err.response || err);

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
