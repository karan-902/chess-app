import axios, {
    AxiosHeaders,
    type AxiosRequestConfig,
    type Method,
} from "axios";
import { toast } from "sonner";
import sessionService from "@/store/sessionService";
import { apiRateLimited } from "@/components/messages";
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
        baseURL: (
            import.meta.env.VITE_API_URL ?? "http://localhost:6060"
        ).trim(),
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

/** Compact relative time, e.g. "2m ago", "3h ago", "1d ago" */
export function formatRelativeTime(ms: number): string {
    const diffSeconds = Math.floor((Date.now() - ms) / 1000);
    if (diffSeconds < 60) return "just now";
    const minutes = Math.floor(diffSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
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

            if (errorStatus === 429) {
                // Same toast `id` across every call site so a burst of 429s
                // (e.g. several requests firing at once) collapses into one
                // visible message instead of stacking duplicates.
                toast.error(apiRateLimited, { id: "rate-limited" });
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

export async function getSpeedHeaders<TPayload = undefined>(
    method: Method,
    path: string,
    data?: TPayload,
): Promise<AxiosRequestConfig> {
    const headers = new AxiosHeaders();
    headers.set(
        "speed-version",
        String(import.meta.env.VITE_SPEED_API_VERSION),
    );
    if (method !== "GET") headers.set("Content-Type", "application/json");
    return {
        baseURL: String(import.meta.env.VITE_SPEED_API_DEV_PAYMENT_BASE_URL),
        method,
        url: path,
        data,
        headers,
        auth: {
            username: String(
                import.meta.env.VITE_KING_STAKE_ACCOUNT_SECRET_KEY,
            ),
            password: "",
        },
    };
}

export const callSpeedAPIInterface = async <
    TResponse = unknown,
    TPayload = undefined,
>(
    method: Method,
    path: string,
    data?: TPayload,
): Promise<TResponse> => {
    return new Promise(async (resolve, reject) => {
        const config = await getSpeedHeaders(method, path, data);
        if (!Object.keys(config).length) {
            reject({});
            return;
        }
        try {
            const res = await axios(config);
            resolve(res.data);
        } catch (err: any) {
            console.error(err);
            console.error("Speed API Error:", err.response || err);
            reject(err);
        }
    });
};
