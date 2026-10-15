import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomChip from "@gopvp/common/src/components/Chip/Chip";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import PieceIcon from "@gopvp/chess/src/components/board/PieceIcon";
import type { IMoveListProps } from "@gopvp/chess/src/types/component";
import {
 cancelPremovesText,
 premoveRouteText,
 noMovesYetText,
} from "@gopvp/chess/src/constants/message";

export default function MoveList({
 moveHistory,
 fenHistory,
 viewIndex,
 onJump,
 premove,
 onCancelPremoves,
 status,
}: IMoveListProps) {
 const movesRef = useRef<HTMLDivElement>(null);
 const [isScrolled, setIsScrolled] = useState(false);
 const effectiveIndex = viewIndex ?? fenHistory.length - 1;
 const premoveKey = premove && `${premove.from}-${premove.to}`;

 useEffect(() => {
  movesRef.current
   ?.querySelector(".active")
   ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
 }, [effectiveIndex]);

 useEffect(() => {
  if (!premoveKey) return;
  movesRef.current
   ?.querySelector(".gr-premove")
   ?.scrollIntoView({ behavior: "smooth", inline: "end", block: "nearest" });
 }, [premoveKey]);

 if (status || (moveHistory.length === 0 && !premove))
  return (
   <Box customClass="gr-move-strip empty">
    {status && <Box customClass="gr-move-spinner" />}
    <Text component="span" customClass="gr-move-empty">
     {status ?? noMovesYetText}
    </Text>
   </Box>
  );

 const indexOffset = moveHistory[0]?.w ? 0 : -1;

 return (
  <Box
   customClass={classNames("gr-move-strip", isScrolled && "scrolled")}
   ref={movesRef}
   onScroll={(event) => setIsScrolled(event.currentTarget.scrollLeft > 0)}
  >
   {moveHistory.map((m, i) => {
    const whiteIndex = i * 2 + 1 + indexOffset;
    const blackIndex = whiteIndex + 1;
    return (
     <Box key={m.n} customClass="gr-move-pair">
      <Text component="span" customClass="gr-move-n">
       {m.n}
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
   {premove && (
    <Box customClass="gr-premove">
     {premove.pieceCode && (
      <PieceIcon code={premove.pieceCode} className="gr-premove-piece" />
     )}
     <Text component="span" customClass="gr-premove-route">
      {premoveRouteText(premove.from, premove.to)}
     </Text>
     <CustomIconButton
      type="button"
      icon="x"
      customClass="gr-premove-cancel"
      aria-label={cancelPremovesText}
      onClick={onCancelPremoves}
     />
    </Box>
   )}
  </Box>
 );
}
