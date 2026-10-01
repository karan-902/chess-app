import { useEffect, useRef } from "react";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomChip from "@gopvp/common/src/components/Chip/Chip";
import type { IMoveListProps } from "@gopvp/chess/src/types/component";

export default function MoveList({
 moveHistory,
 fenHistory,
 viewIndex,
 onJump,
}: IMoveListProps) {
 const movesRef = useRef<HTMLDivElement>(null);
 const effectiveIndex = viewIndex ?? fenHistory.length - 1;

 useEffect(() => {
  movesRef.current
   ?.querySelector(".active")
   ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
 }, [effectiveIndex]);

 if (moveHistory.length === 0) return null;

 const indexOffset = moveHistory[0].w ? 0 : -1;

 return (
  <Box customClass="gr-move-strip" ref={movesRef}>
   {moveHistory.map((m, i) => {
    const whiteIndex = i * 2 + 1 + indexOffset;
    const blackIndex = whiteIndex + 1;
    return (
     <Box key={m.n} customClass="gr-move-pair">
      <Text component="span" customClass="gr-move-n">
       {m.n}.
      </Text>
      {m.w && (
       <CustomChip
        label={m.w}
        customClass={classNames(
         "gr-move-chip",
         effectiveIndex === whiteIndex && "active",
        )}
        onClick={() => onJump(whiteIndex)}
       />
      )}
      {m.b && (
       <CustomChip
        label={m.b}
        customClass={classNames(
         "gr-move-chip",
         effectiveIndex === blackIndex && "active",
        )}
        onClick={() => onJump(blackIndex)}
       />
      )}
     </Box>
    );
   })}
  </Box>
 );
}
