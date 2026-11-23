import { useEffect, useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { useDraggable } from "@dnd-kit/core";
import Box from "@gopvp/common/src/components/Box/Box";
import { PieceIcon } from "@gopvp/common/src/components/constants";
import {
 OPPONENT_MOVE_DURATION_SCALE,
 PIECE_LAND_MS,
 PIECE_SHAKE_MS,
} from "@gopvp/chess/src/constants/limit";
import {
 pieceLandFrames,
 pieceMoveFrames,
 pieceMoveMs,
 pieceShakeFrames,
} from "@gopvp/chess/src/utils";
import {
 prefersReducedMotion,
 shouldReduceMotion,
} from "@gopvp/common/src/util/motion";
import type { IDraggablePieceProps } from "@gopvp/chess/src/types/component";

export default function DraggablePiece({
 square,
 code,
 col,
 row,
 className,
 onClick,
 draggable,
 hidden,
 instant,
 isCaptureMove,
 isInCheck,
}: IDraggablePieceProps) {
 const slotRef = useRef<HTMLDivElement | null>(null);
 const positionRef = useRef({ col, row });
 const moveRef = useRef<Animation | null>(null);
 const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
  id: square,
  data: { code },
  disabled: !draggable,
 });

 useLayoutEffect(() => {
  const el = slotRef.current;
  const from = positionRef.current;
  positionRef.current = { col, row };
  if (!el || (from.col === col && from.row === row) || prefersReducedMotion())
   return;
  moveRef.current?.cancel();
  const land = () =>
   el.animate(pieceLandFrames(col, row, !!isCaptureMove), PIECE_LAND_MS);
  if (instant) {
   land();
   return;
  }
  el.classList.add("moving");
  const move = el.animate(
   pieceMoveFrames(from.col, from.row, col, row),
   pieceMoveMs(from.col, from.row, col, row) *
    (draggable ? 1 : OPPONENT_MOVE_DURATION_SCALE),
  );
  moveRef.current = move;
  move.finished.then(
   () => {
    el.classList.remove("moving");
    land();
   },
   () => el.classList.remove("moving"),
  );
 }, [col, row, instant, isCaptureMove, draggable]);

 useEffect(() => {
  if (isInCheck && !shouldReduceMotion())
   slotRef.current?.animate(pieceShakeFrames(col, row), PIECE_SHAKE_MS);
 }, [isInCheck, col, row]);

 return (
  <Box
   ref={(el: HTMLDivElement | null) => {
    setNodeRef(el);
    slotRef.current = el;
   }}
   {...listeners}
   {...attributes}
   onClick={onClick}
   customClass="chess-piece-slot"
   style={
    {
     transform: `translate3d(${col * 100}%, ${row * 100}%, 0)`,
     cursor: draggable ? "grab" : "pointer",
     opacity: isDragging || hidden ? 0 : 1,
     "--col": col,
    } as CSSProperties
   }
  >
   <PieceIcon code={code} className={className} />
  </Box>
 );
}
