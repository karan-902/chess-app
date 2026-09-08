

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_GOOGLE_CLIENT_ID: string;
    readonly VITE_APP_IMAGE_ICON_S3_URL: string;
    readonly VITE_SOCKET_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
