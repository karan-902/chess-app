import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomChip from "@gopvp/common/src/components/Chip/Chip";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import PieceIcon from "@/components/board/PieceIcon";
import type { IPlayerRowProps } from "@/types/component";
import {
 youText,
 reconnectingText,
 firstMoveText,
} from "@/constants/messages";

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
 scoreLabel,
 capturedPieces,
 pieceColor,
 // advantage,
 clock,
 clockReady,
 isReconnecting,
 firstMoveSeconds,
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
    <Box sx={{ gap: 1 }} customClass="flex">
     <Text customClass="gr-name">{name}</Text>
     {variant === "self" && <CustomChip label={youText} customClass="gr-score" />}
     {scoreLabel && <CustomChip label={scoreLabel} customClass="gr-score" />}
    </Box>
    {isReconnecting && (
     <Text customClass="gr-grace caption">{reconnectingText}</Text>
    )}
    {typeof firstMoveSeconds === "number" && (
     <Text customClass="gr-grace caption">
      {firstMoveText(firstMoveSeconds)}
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
     {/* {advantage !== null && (
      <Text component="span" customClass="gr-advantage caption">
       +{advantage}
      </Text>
     )} */}
    </Box>
   </Box>
   <Text customClass="gr-clock">
    {clockReady ? (
     clock
    ) : (
     <Skeleton variant="rounded" width="2.5rem" height="1.5rem" />
    )}
   </Text>
  </Box>
 );
}
