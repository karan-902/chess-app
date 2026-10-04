import { useDroppable } from "@dnd-kit/core";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import type { IDroppableSquareProps } from "@gopvp/chess/src/types/component";

export default function DroppableSquare({
 square,
 className,
 style,
 onClick,
 premoveMode,
 children,
}: IDroppableSquareProps) {
 const { setNodeRef, isOver } = useDroppable({ id: square });
 return (
  <Box
   ref={setNodeRef}
   customClass={classNames(
    className,
    isOver && (premoveMode ? "square-drag-hover-premove" : "square-drag-hover"),
   )}
   style={style}
   onClick={onClick}
  >
   {children}
  </Box>
 );
}
