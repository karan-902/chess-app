import clsx from "clsx";
import Card from "../../components/base/Card/Card";
import Avatar from "../../components/base/Avatar/Avatar";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import PieceIcon from "@/components/board/PieceIcon";
import { getAvatarUrl } from "@/utils/avatar";
import { CAPTURE_ORDER } from "@/hooks/useChessGame";
import {
    playPlayerRowThinking,
    playPlayerRowYourTurn,
    playPlayerRowPlaying,
    playPlayerRowMakeMovePrefix,
    playPlayerRowMakeMoveSuffix,
} from "@/components/messages";

interface IPlayerRowProps {
    name: string;
    rating: number;
    letter: string;
    avatarSeed?: string | null;
    variant: "primary" | "danger";
    timer: string;
    timerActive: boolean;
    capturedPieces?: string[];
    isThinking?: boolean;
    inactivityWarning?: number | null;
    pieceColor?: "white" | "black";
    streak?: number;
}

function isLowTime(t: string): boolean {
    const [m, s] = t.split(":").map(Number);
    return !isNaN(m) && !isNaN(s) && m === 0 && s < 10;
}

// Same piece rendering the board itself uses, instead of the unicode ♔/♚
// glyphs — those are two different glyph *shapes* at that size (hollow-outline
// vs solid-filled), not just a color difference, and read as muddy rather
// than clearly white/black.
const KING_ICON_CODE: Record<"white" | "black", string> = {
    white: "wK",
    black: "bK",
};

// Each row shows that player's own losses — e.g. a white player's row shows
// white piece icons, since those are the pieces of theirs that died.
const CAPTURED_ICON_CODE: Record<string, string> = {
    p: "P",
    n: "N",
    b: "B",
    r: "R",
    q: "Q",
};

// Grouped by type with a count instead of one icon per dead piece — keeps
// the row a fixed, predictable width for the whole game instead of growing
// (and eventually wrapping) as more material comes off the board.
function groupCaptured(pieces: string[]): { type: string; count: number }[] {
    const counts = new Map<string, number>();
    for (const type of pieces) counts.set(type, (counts.get(type) ?? 0) + 1);
    return CAPTURE_ORDER.filter((type) => counts.has(type)).map((type) => ({
        type,
        count: counts.get(type)!,
    }));
}

function PlayerRow({
    name,
    rating,
    letter,
    avatarSeed,
    variant,
    timer,
    timerActive,
    capturedPieces,
    isThinking,
    inactivityWarning,
    pieceColor,
    streak,
}: IPlayerRowProps) {
    const lowTime = timerActive && isLowTime(timer);
    const showStreak = variant === "primary" && streak != null && streak >= 2;
    const capturedColorPrefix = pieceColor === "white" ? "w" : "b";

    return (
        <Card
            customClass={clsx(
                "player-row",
                timerActive && "turn-active",
                variant === "primary" ? "self" : "opp",
                !timerActive && "turn-inactive",
            )}
        >
            <Box customClass="player-avatar-wrap">
                <Avatar
                    letter={letter}
                    src={getAvatarUrl(avatarSeed)}
                    variant={variant}
                />
                {pieceColor && (
                    <span
                        className={clsx(
                            "player-color-badge",
                            `player-color-badge--${pieceColor}`,
                        )}
                    >
                        <PieceIcon
                            code={KING_ICON_CODE[pieceColor]}
                            className="player-color-badge-icon"
                        />
                    </span>
                )}
            </Box>

            <Box customClass="player-meta">
                <Box customClass="player-name-row">
                    <Text customClass="player-name-text">{name}</Text>
                    <Text customClass="player-rating-text">{rating}</Text>
                    {showStreak && (
                        <span className="streak-badge">🔥{streak}</span>
                    )}
                </Box>
                {capturedPieces && capturedPieces.length > 0 && (
                    <Box customClass="captured-pieces-row">
                        {groupCaptured(capturedPieces).map(
                            ({ type, count }) => (
                                <Box
                                    customClass="captured-piece-chip"
                                    key={type}
                                >
                                    <PieceIcon
                                        code={`${capturedColorPrefix}${CAPTURED_ICON_CODE[type]}`}
                                        className="captured-piece-icon"
                                    />
                                    <Text
                                        as="span"
                                        customClass="captured-piece-count"
                                    >
                                        ×{count}
                                    </Text>
                                </Box>
                            ),
                        )}
                    </Box>
                )}
            </Box>

            <Box customClass="player-row-right">
                <Text
                    as="span"
                    customClass={clsx(
                        "timer-text",
                        timerActive && "active",
                        lowTime && "low-time",
                    )}
                >
                    {timer}
                </Text>
                {isThinking ? (
                    <Box customClass="turn-badge turn-badge--thinking">
                        <Box customClass="thinking-dots">
                            <Text as="span" />
                            <Text as="span" />
                            <Text as="span" />
                        </Box>
                        <Text as="span" customClass="turn-badge-label">
                            {playPlayerRowThinking}
                        </Text>
                    </Box>
                ) : timerActive ? (
                    <Box
                        customClass={clsx(
                            "turn-badge",
                            `turn-badge--${variant}`,
                        )}
                    >
                        <Box customClass="turn-badge-dot" />
                        <Text as="span" customClass="turn-badge-label">
                            {variant === "primary"
                                ? playPlayerRowYourTurn
                                : playPlayerRowPlaying}
                        </Text>
                    </Box>
                ) : null}
            </Box>

            {inactivityWarning != null && (
                <Box
                    customClass={clsx(
                        "inactivity-banner",
                        inactivityWarning <= 10 &&
                            "inactivity-banner--critical",
                    )}
                >
                    <Text as="span" customClass="inactivity-banner-icon">
                        ⏱
                    </Text>
                    <Text as="span" customClass="inactivity-banner-text">
                        {playPlayerRowMakeMovePrefix}{" "}
                        <Text as="span" customClass="inactivity-banner-secs">
                            {inactivityWarning}s
                        </Text>
                        {playPlayerRowMakeMoveSuffix}
                    </Text>
                </Box>
            )}
        </Card>
    );
}

export default PlayerRow;
