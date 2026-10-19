import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import CustomAvatar from "@gopvp/common/src/components/Avatar/Avatar";
import { PieceIcon } from "@gopvp/common/src/components/constants";
import type { IPlayerRowProps } from "@gopvp/chess/src/types/component";
import { FIRST_MOVE_URGENT_SECONDS } from "@gopvp/chess/src/constants/limit";
import { firstMoveText } from "@gopvp/chess/src/constants/message";

function capturedCode(type: string, color: "w" | "b") {
 return `${color}${type.toUpperCase()}`;
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
 lowTime,
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
   <CustomAvatar
    letter={name.charAt(0).toUpperCase()}
    customClass="gr-avatar"
   />
   <Box customClass="gr-meta">
    <Box customClass="gr-name-line">
     <Text customClass="gr-name">{name}</Text>
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

    <Box customClass="gr-sub-line">
     {scoreLabel && (
      <Text component="span" customClass="gr-score-label">
       {scoreLabel}
      </Text>
     )}
     {capturedPieces.length > 0 && (
      <Box customClass="gr-captured">
       {capturedPieces.map((type, i) => (
        <Box
         key={i}
         customClass={classNames(
          "gr-captured-slot",
          capturedPieces[i + 1] !== type && "stack-end",
         )}
        >
         <PieceIcon
          className={classNames(
           "gr-captured-icon",
           pieceColor === "b" && "dark-piece",
          )}
          code={capturedCode(type, pieceColor)}
         />
        </Box>
       ))}
      </Box>
     )}
     {/* {advantage !== null && (
      <Text component="span" customClass="gr-advantage caption">
       +{advantage}
      </Text>
     )} */}
    </Box>
   </Box>
   <Text customClass={classNames("gr-clock", lowTime && "low")}>
    {clockReady ? (
     clock
    ) : (
     <Skeleton customClass="text" width="4rem" />
    )}
   </Text>
  </Box>
 );
}
