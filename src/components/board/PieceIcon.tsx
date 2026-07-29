import { useId } from "react";

interface IPieceIconProps {
    code: string;
    className?: string;
    style?: React.CSSProperties;
}

function PieceShape({ type }: { type: string }) {
    switch (type) {
        case "p":
            return (
                <>
                    <rect x={10} y={33} width={12} height={4} rx={1} />
                    <polygon points="13,33 19,33 17,21 15,21" />
                    <circle cx={16} cy={15} r={6} />
                </>
            );
        case "r":
            return (
                <>
                    <rect x={8} y={33} width={16} height={4} rx={1} />
                    <rect x={10} y={16} width={12} height={17} />
                    <rect x={9} y={9} width={4} height={7} />
                    <rect x={14} y={9} width={4} height={7} />
                    <rect x={19} y={9} width={4} height={7} />
                </>
            );
        case "b":
            return (
                <>
                    <rect x={9} y={33} width={14} height={4} rx={1} />
                    <polygon points="16,10 22,29 10,29" />
                    <circle cx={16} cy={9} r={3.4} />
                    <circle cx={16} cy={4} r={1.6} />
                </>
            );
        case "q":
            return (
                <>
                    <rect x={8} y={33} width={16} height={4} rx={1} />
                    <polygon points="11,33 21,33 19,14 13,14" />
                    <rect x={10.3} y={11.3} width={11.4} height={2.7} />
                    <polygon points="16,5 18.3,8.3 23,5 21.7,11 10.3,11 9,5 13.7,8.3" />
                    <circle cx={16} cy={7.3} r={1.4} />
                    <circle cx={10.3} cy={8.7} r={1} />
                    <circle cx={21.7} cy={8.7} r={1} />
                </>
            );
        case "k":
            return (
                <>
                    <rect x={8} y={33} width={16} height={4} rx={1} />
                    <polygon points="11,33 21,33 19,17 13,17" />
                    <rect x={11} y={17} width={10} height={3} />
                    <circle cx={16} cy={12} r={2.6} />
                    <rect x={15} y={4} width={2} height={8} />
                    <rect x={12} y={6.5} width={8} height={2} />
                </>
            );
        default:
            return null;
    }
}

function KnightShape({ markColor }: { markColor: string }) {
    return (
        <>
            <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" />
            <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" />
            <path
                d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z"
                fill={markColor}
            />
            <path
                d="M 15 15.5 A 0.5 1.5 0 1 1 14,15.5 A 0.5 1.5 0 1 1 15 15.5 z"
                transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"
                fill={markColor}
            />
        </>
    );
}

export default function PieceIcon({ code, className, style }: IPieceIconProps) {
    const filterId = `piece-outline-${useId().replace(/:/g, "")}`;
    const isWhite = code[0] === "w";
    const type = code[1].toLowerCase();
    const fill = isWhite ? "#fdfaf3" : "#000000";
    const outline = isWhite ? "#1a140c" : "#fdfaf3";
    const isKnight = type === "n";

    return (
        <svg
            className={className}
            style={style}
            viewBox={isKnight ? "0 0 45 45" : "0 0 32 40"}
        >
            <defs>
                <filter
                    id={filterId}
                    x="-30%"
                    y="-30%"
                    width="160%"
                    height="160%"
                >
                    <feMorphology
                        in="SourceAlpha"
                        operator="dilate"
                        radius="0.8"
                        result="dilated"
                    />
                    <feFlood floodColor={outline} result="outlineColor" />
                    <feComposite
                        in="outlineColor"
                        in2="dilated"
                        operator="in"
                        result="outline"
                    />
                    <feMerge>
                        <feMergeNode in="outline" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <g fill={fill} filter={`url(#${filterId})`}>
                {isKnight ? (
                    <KnightShape markColor={outline} />
                ) : (
                    <PieceShape type={type} />
                )}
            </g>
        </svg>
    );
}
