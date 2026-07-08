interface IKingStakeLogoProps {
    size?: number;
    showText?: boolean;
}

export default function KingStakeLogo({ size = 24, showText = true }: IKingStakeLogoProps) {
    const fontSize = size * 0.85;

    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: size * 0.38 }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="#f0b90b"
                style={{ flexShrink: 0, filter: "drop-shadow(0 0 6px rgba(240,185,11,0.7))" }}
            >
                <rect x="11" y="1" width="2" height="6" rx="1" />
                <rect x="7.5" y="3" width="9" height="2" rx="1" />
                <path d="M2 9 L5 18 L19 18 L22 9 L17 14 L12 8 L7 14 Z" />
                <rect x="4" y="18" width="16" height="2.5" rx="1.25" />
            </svg>

            {showText && (
                <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                    color: "#f0b90b",
                    textShadow: "0 0 18px rgba(240,185,11,0.5)",
                }}>
                    KingStake
                </span>
            )}
        </span>
    );
}
