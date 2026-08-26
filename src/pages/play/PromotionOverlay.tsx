import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import PieceIcon from "@/components/board/PieceIcon";
import type { IPromotionOverlayProps } from "@/types/components";
import {
    playPromotionTitle,
    playPromotionQueen,
    playPromotionRook,
    playPromotionBishop,
    playPromotionKnight,
} from "@/constants/messages";

const PROMOTION_PIECES = ["q", "r", "b", "n"] as const;
const PROMOTION_LABEL: Record<(typeof PROMOTION_PIECES)[number], string> = {
    q: playPromotionQueen,
    r: playPromotionRook,
    b: playPromotionBishop,
    n: playPromotionKnight,
};

export default function PromotionOverlay({
    playerSide,
    onSelect,
    onCancel,
}: IPromotionOverlayProps) {
    return (
        <Box customClass="gr-promotion-overlay" onClick={onCancel}>
            <Box
                customClass="gr-promotion-card"
                onClick={(e) => e.stopPropagation()}
            >
                <Text customClass="gr-promotion-label caption">
                    {playPromotionTitle}
                </Text>
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
