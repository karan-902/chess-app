import { useState } from "react";
import type { TransitionEvent } from "react";
import { useDraggable } from "@dnd-kit/core";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import PieceIcon from "@gopvp/chess/src/components/board/PieceIcon";
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
}: IDraggablePieceProps) {
 const [isMoving, setIsMoving] = useState(false);
 const [position, setPosition] = useState({ col, row });
 const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
  id: square,
  data: { code },
  disabled: !draggable,
 });

 if (position.col !== col || position.row !== row) {
  setPosition({ col, row });
  setIsMoving(!instant);
 }

 const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
  if (e.target === e.currentTarget && e.propertyName === "transform")
   setIsMoving(false);
 };

 return (
  <Box
   ref={setNodeRef}
   {...listeners}
   {...attributes}
   onClick={onClick}
   onTransitionEnd={handleTransitionEnd}
   customClass={classNames(
    "chess-piece-slot",
    isMoving && "moving",
    instant && "instant",
   )}
   style={{
    transform: `translate3d(${col * 100}%, ${row * 100}%, 0)`,
    cursor: draggable ? "grab" : "pointer",
    opacity: isDragging || hidden ? 0 : 1,
   }}
  >
   <PieceIcon code={code} className={className} />
  </Box>
 );
}
