import clsx from "clsx";
import Card from "../../components/base/Card/Card";
import Avatar from "../../components/base/Avatar/Avatar";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";

interface IPlayerRowProps {
    name: string;
    rating: number;
    letter: string;
    variant: "primary" | "danger";
    timer: string;
    timerActive: boolean;
    captured?: string;
    isThinking?: boolean;
    inactivityWarning?: number | null;
}

function isLowTime(t: string): boolean {
    const [m, s] = t.split(":").map(Number);
    return !isNaN(m) && !isNaN(s) && m === 0 && s < 10;
}

function PlayerRow({
    name,
    rating,
    letter,
    variant,
    timer,
    timerActive,
    captured,
    isThinking,
    inactivityWarning,
}: IPlayerRowProps) {
    const lowTime = timerActive && isLowTime(timer);

    return (
        <Card
            customClass={clsx(
                "player-row",
                timerActive && "turn-active",
                variant === "primary" && "self",
                !timerActive && "turn-inactive",
            )}
        >
            <Avatar letter={letter} variant={variant} />

            <Box customClass="player-meta">
                <Box customClass="player-name-row">
                    <Text customClass="player-name-text">{name}</Text>
                    <Text customClass="player-rating-text">{rating}</Text>
                </Box>
                {captured && (
                    <Text font="mono" size={10} color="muted">
                        {captured}
                    </Text>
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
                        <Text as="span" customClass="turn-badge-label">Thinking</Text>
                    </Box>
                ) : timerActive ? (
                    <Box customClass={clsx("turn-badge", `turn-badge--${variant}`)}>
                        <Box customClass="turn-badge-dot" />
                        <Text as="span" customClass="turn-badge-label">
                            {variant === "primary" ? "Your Turn" : "Playing"}
                        </Text>
                    </Box>
                ) : null}
            </Box>

            {inactivityWarning != null && (
                <Box customClass="inactivity-banner">
                    <Text as="span" customClass="inactivity-banner-icon">⏱</Text>
                    <Text as="span" customClass="inactivity-banner-text">
                        Make a move in{" "}
                        <Text as="span" customClass="inactivity-banner-secs">
                            {inactivityWarning}s
                        </Text>
                        {" "}or lose
                    </Text>
                </Box>
            )}
        </Card>
    );
}

export default PlayerRow;
