import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import PieceIcon from "@gopvp/chess/src/components/board/PieceIcon";
import type { IPlayerRowProps } from "@gopvp/chess/src/types/component";
import { FIRST_MOVE_URGENT_SECONDS } from "@gopvp/chess/src/constants/limit";
import {
 reconnectingText,
 firstMoveText,
} from "@gopvp/chess/src/constants/message";

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
    <Box customClass="gr-name-line">
     <Text customClass="gr-name">{name}</Text>
     {scoreLabel && (
      <Text component="span" customClass="gr-score-label">
       {scoreLabel}
      </Text>
     )}
     {isReconnecting && (
      <Text component="span" customClass="gr-grace caption">
       {reconnectingText}
      </Text>
     )}
     {typeof firstMoveSeconds === "number" && (
      <Text
       component="span"
       customClass={classNames(
        "gr-first-move",
        firstMoveSeconds <= FIRST_MOVE_URGENT_SECONDS && "urgent",
       )}
      >
       {firstMoveText(firstMoveSeconds)}
      </Text>
     )}
    </Box>

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
     <Skeleton customClass="text" width="4rem" />
    )}
   </Text>
  </Box>
 );
}
