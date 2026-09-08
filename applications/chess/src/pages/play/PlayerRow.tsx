import classNames from "classnames";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import PieceIcon from "@/components/board/PieceIcon";
import type { IPlayerRowProps } from "@/types/components";
import { playOpponentGraceLabel } from "@/constants/messages";

function capturedCode(type: string, color: "w" | "b") {
    return `${color}${type.toUpperCase()}`;
}

function pairCapturedPieces(types: string[]) {
    return types.map((type, i) => ({
        type,
        stacked: types[i - 1] === type,
        stackEnd: i + 1 < types.length && types[i + 1] !== type,
    }));
}

export default function PlayerRow({
    variant,
    active,
    name,
    eloLabel,
    capturedPieces,
    pieceColor,
    advantage,
    clock,
    clockReady,
    graceSecondsRemaining,
}: IPlayerRowProps) {
    return (
        <Box
            customClass={classNames(
                "gr-row",
                variant === "opponent" ? "opp" : "me",
                active && "active",
            )}
        >
            <Box customClass="gr-meta">
                <Text customClass="gr-name" truncate>
                    {name}
                </Text>
                <Text customClass="gr-elo caption">{eloLabel}</Text>
                {typeof graceSecondsRemaining === "number" && (
                    <Text customClass="gr-grace caption">
                        {playOpponentGraceLabel(graceSecondsRemaining)}
                    </Text>
                )}

                <Box customClass="gr-captured">
                    {pairCapturedPieces(capturedPieces).map(
                        ({ type, stacked, stackEnd }, i) => (
                            <PieceIcon
                                key={i}
                                className={classNames(
                                    "gr-captured-icon",
                                    pieceColor === "b" && "dark-piece",
                                    stacked && "stacked",
                                    stackEnd && "stack-end",
                                )}
                                code={capturedCode(type, pieceColor)}
                            />
                        ),
                    )}
                    {advantage !== null && (
                        <Text
                            component="span"
                            customClass="gr-advantage caption"
                        >
                            +{advantage}
                        </Text>
                    )}
                </Box>
            </Box>
            <Text customClass="gr-clock">
                {clockReady ? (
                    clock
                ) : (
                    <Skeleton
                        variant="rounded"
                        width="2.5rem"
                        height="1.5rem"
                    />
                )}
            </Text>
        </Box>
    );
}
