import { useDraggable } from "@dnd-kit/core";
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
}: IDraggablePieceProps) {
 const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
  id: square,
  data: { code },
  disabled: !draggable,
 });

 return (
  <div
   ref={setNodeRef}
   {...listeners}
   {...attributes}
   onClick={onClick}
   className="chess-piece-slot"
   style={{
    transform: `translate(${col * 100}%, ${row * 100}%)`,
    cursor: draggable ? "grab" : "pointer",
    opacity: isDragging || hidden ? 0 : 1,
   }}
  >
   <PieceIcon code={code} className={className} />
  </div>
 );
}
