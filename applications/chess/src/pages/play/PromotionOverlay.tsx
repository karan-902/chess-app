import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import PieceIcon from "@/components/board/PieceIcon";
import type { IPromotionOverlayProps } from "@/types/component";
import {
 promotePawnText,
 queenText,
 rookText,
 bishopText,
 knightText,
} from "@/constants/messages";

const PROMOTION_PIECES = ["q", "r", "b", "n"] as const;
const PROMOTION_LABEL: Record<(typeof PROMOTION_PIECES)[number], string> = {
 q: queenText,
 r: rookText,
 b: bishopText,
 n: knightText,
};

export default function PromotionOverlay({
 playerSide,
 onSelect,
 onCancel,
}: IPromotionOverlayProps) {
 return (
  <Box customClass="gr-promotion-overlay" onClick={onCancel}>
   <Box customClass="gr-promotion-card" onClick={(e) => e.stopPropagation()}>
    <Text customClass="gr-promotion-label caption">{promotePawnText}</Text>
    <Box customClass="gr-promotion-options">
     {PROMOTION_PIECES.map((piece) => (
      <Button
       key={piece}
       type="button"
       customClass="gr-promotion-btn"
       onClick={() => onSelect(piece)}
       aria-label={PROMOTION_LABEL[piece]}
      >
       <PieceIcon
        code={`${playerSide}${piece.toUpperCase()}`}
        className="gr-promotion-icon"
       />
      </Button>
     ))}
    </Box>
   </Box>
  </Box>
 );
}
