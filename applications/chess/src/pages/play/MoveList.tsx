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

 return (
  <Box customClass="gr-move-strip" ref={movesRef}>
   {moveHistory.map((m, i) => {
    const isWhiteActive = effectiveIndex === i * 2 + 1;
    const isBlackActive = effectiveIndex === i * 2 + 2;
    return (
     <Box key={m.n} customClass="gr-move-pair">
      <Text component="span" customClass="gr-move-n">
       {m.n}.
      </Text>
      <CustomChip
       label={m.w}
       customClass={classNames("gr-move-chip", isWhiteActive && "active")}
       onClick={() => onJump(i * 2 + 1)}
      />
      {m.b && (
       <CustomChip
        label={m.b}
        customClass={classNames("gr-move-chip", isBlackActive && "active")}
        onClick={() => onJump(i * 2 + 2)}
       />
      )}
     </Box>
    );
   })}
  </Box>
 );
}
