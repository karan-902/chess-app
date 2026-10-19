interface ImportMetaEnv {
 readonly VITE_API_URL: string;
 readonly VITE_GOOGLE_CLIENT_ID: string;
 readonly VITE_APP_IMAGE_ICON_S3_URL: string;
 readonly VITE_APP_LOTTIE_BASE_URL: string;
 readonly VITE_SOCKET_URL: string;
 readonly VITE_FLAG_API: string;
 readonly VITE_FIREBASE_API_KEY: string;
 readonly VITE_FIREBASE_AUTH_DOMAIN: string;
 readonly VITE_FIREBASE_PROJECT_ID: string;
 readonly VITE_FIREBASE_APP_ID: string;
}

interface ImportMeta {
 readonly env: ImportMetaEnv;
}
