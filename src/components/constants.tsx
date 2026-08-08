import Text from "./base/Text/Text";

export function GoogleIcon({ size = 18 }: { size: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}

export function ShatranjLogo({
    size = 40,
    showText = true,
    withCursor = false,
}: {
    size: number;
    showText: boolean;
    withCursor?: boolean;
}) {
    const fontSize = size * 0.85;
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: size * 0.38,
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 48 48"
                style={{
                    flexShrink: 0,
                    filter: "drop-shadow(0 0 6px rgba(247,147,26,0.6))",
                }}
            >
                <path
                    d="M24 5L27.5 13L34.5 8L32.5 17H15.5L13.5 8L20.5 13L24 5Z"
                    fill="#f7931a"
                />
                <rect x="15.5" y="17" width="17" height="4" fill="#f7931a" />
                <path
                    d="M16 25H32L30 39C30 40.66 27.31 42 24 42C20.69 42 18 40.66 18 39L16 25Z"
                    fill="#f7931a"
                />
                <circle cx="24" cy="10" r="2" fill="#39ff88" />
                <circle cx="13.5" cy="12.5" r="1.5" fill="#39ff88" />
                <circle cx="34.5" cy="12.5" r="1.5" fill="#39ff88" />
            </svg>

            {showText && (
                <Text customClass="shatranj-logo">
                    Shatranj
                    {withCursor && <span className="logo-cursor" />}
                </Text>
            )}
        </span>
    );
}
