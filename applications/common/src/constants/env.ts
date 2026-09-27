export const env = import.meta.env;

export const apiUrl = (env.VITE_API_URL ?? "http://localhost:6060").trim();
export const socketUrl = (
 env.VITE_SOCKET_URL ?? "http://localhost:6060"
).trim();
export const googleClientId = env.VITE_GOOGLE_CLIENT_ID;
export const imageIconS3Url = env.VITE_APP_IMAGE_ICON_S3_URL;
export const lottieBaseUrl = env.VITE_APP_LOTTIE_BASE_URL;
