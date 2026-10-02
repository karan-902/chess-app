import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { motion } from "motion/react";
import classNames from "classnames";
import PieceIcon from "@gopvp/chess/src/components/board/PieceIcon";
import { PIECE_MOVE_SPRING } from "@gopvp/chess/src/constants/limit";
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
 const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
  id: square,
  data: { code },
  disabled: !draggable,
 });

 return (
  <motion.div
   ref={setNodeRef}
   {...listeners}
   {...attributes}
   onClick={onClick}
   className={classNames("chess-piece-slot", isMoving && "moving")}
   initial={false}
   animate={{ x: `${col * 100}%`, y: `${row * 100}%` }}
   transition={instant ? { duration: 0 } : PIECE_MOVE_SPRING}
   onAnimationStart={() => !instant && setIsMoving(true)}
   onAnimationComplete={() => setIsMoving(false)}
   style={{
    cursor: draggable ? "grab" : "pointer",
    opacity: isDragging || hidden ? 0 : 1,
   }}
  >
   <PieceIcon code={code} className={className} />
  </motion.div>
 );
}
