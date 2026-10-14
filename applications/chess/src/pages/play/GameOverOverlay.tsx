import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import StatTile from "@gopvp/common/src/components/StatTile/StatTile";
import { formatAmount } from "@gopvp/common/src/util/format";
import { GAME_LOGO_PATH } from "@gopvp/chess/src/constants/asset";
import { RESULT_COUNT_TIMING } from "@gopvp/chess/src/constants/limit";
import { MATCH_OUTCOME_SUBTITLES } from "@gopvp/common/src/constants/mapper";
import { easeOutCubic, prefersReducedMotion } from "@gopvp/chess/src/utils/index";
import WinBurst from "@gopvp/chess/src/pages/play/WinBurst";
import type { IGameOverOverlayProps } from "@gopvp/chess/src/types/component";
import {
 backText,
 chessText,
 winningsText,
 refundText,
 matchCancelledText,
 scoreText,
} from "@gopvp/common/src/constants/message";

const AMOUNT_LABELS = {
 win: winningsText,
 loss: winningsText,
 draw: refundText,
 match_cancelled: matchCancelledText,
};

export default function GameOverOverlay({
 gameEnded,
 outcome,
 isPvc,
 opponentName,
 onNewGame,
}: IGameOverOverlayProps) {
 const [isLogoLoaded, setIsLogoLoaded] = useState(false);
 const logoRef = useRef<HTMLImageElement>(null);
 const amountTileRef = useRef<HTMLDivElement>(null);
 const [isReducedMotion] = useState(prefersReducedMotion);
 const countTiming =
  outcome === "match_cancelled" ? undefined : RESULT_COUNT_TIMING[outcome];
 const [countProgress, setCountProgress] = useState(
  countTiming && !isReducedMotion ? 0 : 1,
 );
 const tone = outcome === "win" || outcome === "loss" ? outcome : "neutral";
 const scoreChange = Math.round(gameEnded.score_change);
 const amount = gameEnded.amount * countProgress;
 const showBurst =
  outcome === "win" && !isPvc && gameEnded.amount > 0 && !isReducedMotion;

 useEffect(() => {
  if (!countTiming || isReducedMotion) return;
  let raf = 0;
  const start = performance.now();
  const tick = (now: number) => {
   const progress = easeOutCubic(
    ((now - start) / 1000 - countTiming.startS) / countTiming.durationS,
   );
   setCountProgress(progress);
   if (progress < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
 }, [countTiming, isReducedMotion]);

 const tiles = [
  {
   key: "amount",
   label: AMOUNT_LABELS[outcome],
   value: `${amount > 0 ? "+" : ""}${formatAmount(amount)}`,
   change: gameEnded.amount,
  },
  ...(scoreChange === 0
   ? []
   : [
      {
       key: "score",
       label: scoreText,
       value: `${scoreChange > 0 ? "+" : ""}${scoreChange}`,
       change: scoreChange,
      },
     ]),
 ];

 return (
  <CustomDrawer
   anchor="bottom"
   open
   onClose={onNewGame}
   customClass={classNames("result-sheet game-over-sheet", tone)}
  >
   <Box customClass="result-hero">
    {!isLogoLoaded && (
     <Skeleton variant="rounded" customClass="result-logo-skeleton" />
    )}
    <img
     ref={logoRef}
     src={GAME_LOGO_PATH}
     alt=""
     hidden={!isLogoLoaded}
     onLoad={() => setIsLogoLoaded(true)}
    />
    <Text customClass="result-title">{chessText}</Text>
    <Text customClass="result-subtitle">
     {MATCH_OUTCOME_SUBTITLES[outcome](opponentName)}
    </Text>
   </Box>

   {!isPvc && (
    <Box customClass={classNames("result-tiles", { single: tiles.length === 1 })}>
     {tiles.map(({ key, label, value, change }) => (
      <StatTile
       key={key}
       ref={key === "amount" ? amountTileRef : undefined}
       label={label}
       value={value}
       customClass={classNames({
        "loss-edge": key === "amount" && outcome === "loss",
        "refund-sheen": key === "amount" && outcome === "draw",
       })}
       valueClass={classNames({
        pos: change > 0 && outcome !== "draw" && outcome !== "match_cancelled",
        neg: change < 0,
        refund: key === "amount" && outcome === "draw",
        returned: key === "amount" && outcome === "match_cancelled",
        shake: key === "amount" && outcome === "loss",
       })}
      />
     ))}
    </Box>
   )}

   {showBurst && <WinBurst originRef={logoRef} targetRef={amountTileRef} />}

   <Button
    type="button"
    variant="contained"
    fullWidth
    customClass="game-cta result-back-btn"
    onClick={onNewGame}
   >
    {backText}
   </Button>
  </CustomDrawer>
 );
}
