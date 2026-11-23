import { useEffect, useLayoutEffect, useRef } from "react";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomAvatar from "@gopvp/common/src/components/Avatar/Avatar";
import Ticket from "@gopvp/common/src/components/Ticket/Ticket";
import { formatAmount } from "@gopvp/common/src/util/format";
import { scoreText } from "@gopvp/common/src/constants/message";
import {
 payoutText,
 lossText,
 refundText,
 freePlayTicketText,
 wonText,
 lostText,
 drawText,
 cancelledText,
 vsText,
} from "@gopvp/chess/src/constants/message";
import { CoinStarIcon } from "@gopvp/common/src/components/constants";
import {
 PAYOUT_TIMING,
 PAYOUT_COIN_COUNT,
 PAYOUT_SPARK_COUNT,
} from "@gopvp/chess/src/constants/limit";
import { clamp01, easeOutCubic } from "@gopvp/chess/src/utils/index";
import { shouldReduceMotion } from "@gopvp/common/src/util/motion";
import type { IPayoutTicketProps } from "@gopvp/chess/src/types/component";

const STAMPS = {
 win: wonText,
 loss: lostText,
 draw: drawText,
 match_cancelled: cancelledText,
};
const TITLES = {
 win: payoutText,
 loss: lossText,
 draw: refundText,
 match_cancelled: refundText,
};
const COINS = Array.from({ length: PAYOUT_COIN_COUNT }, (_, i) => ({
 size: 18 + (i % 3) * 4,
 delay: i * 0.07,
 duration: 0.8,
 spread: (i % 2 ? 1 : -1) * (60 + i * 14),
 lift: 150 + (i % 3) * 30,
 spin: (i % 2 ? 1 : -1) * 220,
}));
const SPARKS = Array.from({ length: PAYOUT_SPARK_COUNT }, (_, i) => ({
 angle: (i / PAYOUT_SPARK_COUNT) * Math.PI * 2,
 radius: 46 + (i % 3) * 14,
 delay: (i % 4) * 0.04,
}));
const SPARK_LIFE_S = 0.7;
const initialOf = (name: string) => name.charAt(0).toUpperCase();
const signedAmount = (value: number) =>
 `${value > 0 ? "+" : ""}${formatAmount(value)}`;

export default function PayoutTicket({
 gameEnded,
 outcome,
 isPvc,
 myName,
 opponentName,
}: IPayoutTicketProps) {
 const stageRef = useRef<HTMLDivElement>(null);
 const slotRef = useRef<HTMLDivElement>(null);
 const amountRef = useRef<HTMLSpanElement>(null);
 const coinRefs = useRef<(SVGSVGElement | null)[]>([]);
 const sparkRefs = useRef<(HTMLDivElement | null)[]>([]);
 const scoreChange = Math.round(gameEnded.score_change);
 const amount = gameEnded.amount;
 const isWin = outcome === "win";
 const hasCoins = isWin && !isPvc && amount > 0;
 const timing =
  isPvc || outcome === "match_cancelled"
   ? PAYOUT_TIMING.quick
   : PAYOUT_TIMING[outcome];

 useLayoutEffect(() => {
  const stage = stageRef.current;
  const ticket = stage?.querySelector<HTMLElement>(".payout-ticket");
  if (!stage || !ticket) return;
  const fit = () =>
   stage.style.setProperty("--ticket-h", `${ticket.offsetHeight}px`);
  fit();
  const observer = new ResizeObserver(fit);
  observer.observe(ticket);
  return () => observer.disconnect();
 }, []);

 useEffect(() => {
  const stage = stageRef.current;
  const amountEl = amountRef.current;
  if (!stage) return;
  const finalText = signedAmount(amount);
  const decimals = finalText.split(".")[1]?.length ?? 0;
  const integerDigits = Math.trunc(Math.abs(amount)).toString().length;
  const countFrom =
   integerDigits > 1 ? Math.sign(amount) * 10 ** (integerDigits - 1) : 0;
  let shownText = finalText;
  const paintCount = (value: number) => {
   const rounded = Math.round(Math.abs(value) * 10 ** decimals) / 10 ** decimals;
   shownText = signedAmount(Math.sign(amount) * rounded);
   if (decimals && !shownText.includes("."))
    shownText = `${shownText}.${"0".repeat(decimals)}`;
   if (amountEl && amountEl.textContent !== shownText)
    amountEl.textContent = shownText;
  };
  const measure = () => {
   if (!amountEl) return;
   amountEl.style.width = "";
   amountEl.textContent = finalText;
   amountEl.style.width = `${amountEl.offsetWidth}px`;
   amountEl.textContent = shownText;
  };
  measure();
  let isActive = true;
  document.fonts.ready.then(() => isActive && measure());
  if (shouldReduceMotion()) {
   stage.classList.add("rising", "stamped");
   return () => {
    isActive = false;
   };
  }

  const center = (el: HTMLElement) => {
   let x = el.offsetWidth / 2;
   let y = el.offsetHeight / 2;
   for (
    let node: HTMLElement | null = el;
    node && node !== stage;
    node = node.offsetParent as HTMLElement | null
   ) {
    x += node.offsetLeft;
    y += node.offsetTop;
   }
   return { x, y };
  };
  const target = center(
   amountEl ?? (stage.querySelector(".payout-stamp") as HTMLElement),
  );
  const origin = slotRef.current ? center(slotRef.current) : target;
  const once = new Set<string>();
  const fire = (
   key: string,
   at: number | undefined,
   t: number,
   run: () => void,
  ) => {
   if (at === undefined || once.has(key) || t < at) return;
   once.add(key);
   run();
  };
  const landed = new Set<number>();
  let raf = 0;
  const start = performance.now();
  if (timing.count !== undefined) paintCount(countFrom);

  const frame = (now: number) => {
   const t = (now - start) / 1000;
   fire("rise", timing.rise, t, () => stage.classList.add("rising"));
   fire("stamp", timing.stamp, t, () => stage.classList.add("stamped"));
   fire("glare", timing.glare, t, () => stage.classList.add("glare"));
   fire("shake", timing.shake, t, () => stage.classList.add("shaking"));

   if (timing.count !== undefined && timing.countDur && t >= timing.count)
    paintCount(
     countFrom +
      (amount - countFrom) *
       easeOutCubic((t - timing.count) / timing.countDur),
    );

   const burstT = t - (timing.burst ?? Infinity);
   if (hasCoins && burstT >= 0 && burstT < 1.4) {
    COINS.forEach((coin, i) => {
     const el = coinRefs.current[i];
     const k = clamp01((burstT - coin.delay) / coin.duration);
     if (!el || k <= 0 || landed.has(i)) return;
     if (k >= 1) {
      landed.add(i);
      el.style.opacity = "0";
      return;
     }
     const e = easeOutCubic(k);
     const u = 1 - e;
     const cx = origin.x + coin.spread;
     const cy = origin.y - coin.lift;
     const x = u * u * origin.x + 2 * u * e * cx + e * e * target.x;
     const y = u * u * origin.y + 2 * u * e * cy + e * e * target.y;
     el.style.transform = `translate3d(${x - coin.size / 2}px,${y - coin.size / 2}px,0) rotate(${coin.spin * e}deg) scale(${1 - 0.35 * e})`;
     el.style.opacity = String(
      k < 0.08 ? k / 0.08 : k > 0.85 ? (1 - k) / 0.15 : 1,
     );
    });
   }

   const sparkT = t - (isWin ? (timing.sparks ?? Infinity) : Infinity);
   if (sparkT >= 0 && sparkT < 1) {
    SPARKS.forEach((spark, i) => {
     const el = sparkRefs.current[i];
     const k = clamp01((sparkT - spark.delay) / SPARK_LIFE_S);
     if (!el) return;
     const distance = easeOutCubic(k) * spark.radius;
     const grow = k < 0.3 ? k / 0.3 : 1 - (k - 0.3) / 0.7;
     el.style.transform = `translate3d(${target.x + Math.cos(spark.angle) * distance}px,${target.y + Math.sin(spark.angle) * distance * 0.7}px,0) rotate(${k * 120}deg) scale(${grow})`;
     el.style.opacity = k > 0 && k < 1 ? "1" : "0";
    });
   }

   if (t < (timing.end ?? 0)) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return () => {
   isActive = false;
   cancelAnimationFrame(raf);
  };
 }, [amount, hasCoins, isWin, timing]);

 return (
  <Box
   ref={stageRef}
   customClass={classNames(
    "payout-stage",
    isPvc ? `practice ${outcome}` : outcome,
    {
     lit: isWin,
    },
   )}
  >
   <Box customClass="payout-floor" />
   <Box customClass="payout-beam" />
   <Box customClass="payout-rise">
    <Box customClass="payout-ticket">
     <Ticket
      customClass="payout-paper"
      stub={
       <Text component="span" customClass="payout-stub-label">
        {isPvc ? freePlayTicketText : TITLES[outcome]}
       </Text>
      }
      top={
       <Box customClass="payout-players">
        <Box customClass="payout-side">
         <CustomAvatar letter={initialOf(myName)} customClass="ticket-me" />
         <Text customClass="ticket-name">{myName}</Text>
        </Box>
        <Text component="span" customClass="ticket-vs">
         {vsText}
        </Text>
        <Box customClass="payout-side rival">
         <CustomAvatar
          letter={initialOf(opponentName)}
          customClass="payout-rival"
         />
         <Text customClass="ticket-name">{opponentName}</Text>
        </Box>
       </Box>
      }
      bottom={
       <Box customClass="payout-bottom">
        <Box customClass="payout-stamp-shadow" />
        <Text component="span" customClass="payout-stamp">
         {STAMPS[outcome]}
        </Text>
        {!isPvc && (
         <Text customClass="payout-amount">
          <span ref={amountRef} aria-label={signedAmount(amount)} />
         </Text>
        )}
        {!isPvc && scoreChange !== 0 && (
         <Text customClass="payout-score">
          {`${scoreText} ${scoreChange > 0 ? "+" : ""}${scoreChange}`}
         </Text>
        )}
       </Box>
      }
     />
    </Box>
   </Box>
   <Box ref={slotRef} customClass="payout-slot" />
   {hasCoins &&
    COINS.map((coin, i) => (
     <CoinStarIcon
      key={i}
      ref={(el: SVGSVGElement | null) => {
       coinRefs.current[i] = el;
      }}
      className="payout-coin"
      style={{ width: coin.size, height: coin.size }}
     />
    ))}
   {isWin &&
    SPARKS.map((spark, i) => (
     <Box
      key={spark.angle}
      ref={(el: HTMLDivElement | null) => {
       sparkRefs.current[i] = el;
      }}
      customClass="payout-spark"
     />
    ))}
  </Box>
 );
}
