import { useEffect, useRef } from "react";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import { CARD_LOGO_PATH } from "@gopvp/app/src/constants/asset";
import { matchedText } from "@gopvp/app/src/constants/message";
import {
 MATCH_DECK_GAP_PX,
 MATCH_DECK_SWAP_MS,
 MATCH_DECK_SWAP_MIN_MS,
 MATCH_DECK_SWAP_STEP_MS,
 MATCH_DECK_PAUSE_MS,
} from "@gopvp/app/src/constants/limit";
import type { IMatchDeckProps } from "@gopvp/app/src/types/component";

const START_SLOTS = [-1, 0, 1];
const SLOT_PAIRS = [
 [-1, 0],
 [0, 1],
 [-1, 1],
];
const SWAP_EASING = "cubic-bezier(.45,0,.2,1)";
const at = (slot: number, extra = "") =>
 `translateX(${slot * MATCH_DECK_GAP_PX}px) ${extra}`;

export default function MatchDeck({ isRevealed, opponentName }: IMatchDeckProps) {
 const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
 const slotsRef = useRef([...START_SLOTS]);

 useEffect(() => {
  const cards = cardRefs.current;
  if (isRevealed) {
   cards.forEach((card, index) => {
    card?.getAnimations().forEach((animation) => animation.cancel());
    card?.classList.add(slotsRef.current[index] === 0 ? "is-center" : "is-side");
   });
   return;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let isActive = true;
  let swapMs = MATCH_DECK_SWAP_MS;

  const swap = async () => {
   const slots = slotsRef.current;
   const [from, to] = SLOT_PAIRS[Math.floor(Math.random() * SLOT_PAIRS.length)];
   const over = slots.indexOf(from);
   const under = slots.indexOf(to);
   const overCard = cards[over];
   const underCard = cards[under];
   if (!overCard || !underCard) return;
   const mid = ((from + to) / 2) * MATCH_DECK_GAP_PX;
   overCard.style.zIndex = "3";
   underCard.style.zIndex = "1";
   const options = { duration: swapMs, easing: SWAP_EASING, fill: "forwards" as const };
   await Promise.all([
    overCard.animate(
     [
      { transform: at(from) },
      { transform: `translateX(${mid}px) translateY(-26px) scale(1.08)`, offset: 0.5 },
      { transform: at(to) },
     ],
     options,
    ).finished,
    underCard.animate(
     [
      { transform: at(to) },
      { transform: `translateX(${mid}px) translateY(10px) scale(.92)`, offset: 0.5 },
      { transform: at(from) },
     ],
     options,
    ).finished,
   ]).catch(() => {});
   if (!isActive) return;
   slots[over] = to;
   slots[under] = from;
   [overCard, underCard].forEach((card, i) => {
    card.getAnimations().forEach((animation) => animation.cancel());
    card.style.transform = at(i === 0 ? to : from);
   });
  };

  const loop = async () => {
   while (isActive) {
    await swap();
    await new Promise((resolve) => setTimeout(resolve, MATCH_DECK_PAUSE_MS));
    swapMs = Math.max(MATCH_DECK_SWAP_MIN_MS, swapMs - MATCH_DECK_SWAP_STEP_MS);
   }
  };
  loop();

  return () => {
   isActive = false;
  };
 }, [isRevealed]);

 return (
  <Box customClass={classNames("match-deck", isRevealed && "revealed")}>
   {START_SLOTS.map((slot, index) => (
    <Box
     key={slot}
     ref={(node: HTMLDivElement | null) => {
      cardRefs.current[index] = node;
     }}
     customClass={classNames("match-card", slot < 0 ? "left" : slot > 0 && "right")}
     style={{ transform: at(slot) }}
    >
     <Box customClass="match-card-inner">
      <Box customClass="match-card-back">
       <img src={CARD_LOGO_PATH} alt="" />
      </Box>
      <Box customClass="match-card-face">
       {opponentName && (
        <Text component="span" customClass="match-card-avatar">
         {opponentName.charAt(0).toUpperCase()}
        </Text>
       )}
       <Text component="span" customClass="match-card-name">
        {opponentName || matchedText}
       </Text>
      </Box>
     </Box>
    </Box>
   ))}
  </Box>
 );
}
