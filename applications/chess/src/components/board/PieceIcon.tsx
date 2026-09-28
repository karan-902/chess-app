import { PIECE_PATHS } from "@gopvp/chess/src/constants/asset";
import type { IPieceIconProps } from "@gopvp/chess/src/types/component";

export default function PieceIcon({
 code,
 className,
 style,
 onPointerDown,
}: IPieceIconProps) {
 return (
  <svg
   className={className}
   style={style}
   viewBox="0 0 45 45"
   onPointerDown={onPointerDown}
  >
   {PIECE_PATHS[code]}
  </svg>
 );
}
