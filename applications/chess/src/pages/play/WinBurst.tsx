import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import { WIN_CONFETTI_COLORS } from "@gopvp/chess/src/constants/color";
import {
 WIN_BURST_LEAD_S,
 WIN_BURST_END_S,
 WIN_BURST_COIN_COUNT,
 WIN_BURST_SPARK_COUNT,
 WIN_BURST_CONFETTI_COUNT,
 WIN_BURST_STREAK_COUNT,
 WIN_BURST_POP_COUNT,
 WIN_BURST_SEED,
} from "@gopvp/chess/src/constants/limit";
import {
 clamp01,
 smoothStep,
 easeOutCubic,
} from "@gopvp/chess/src/utils/index";
import type { IWinBurstProps } from "@gopvp/chess/src/types/component";

const DEPTHS = [0.55, 0.8, 1];
const LINE_BASE = 100;

function createRandom(seed: number) {
 let state = seed;
 return (min: number, max: number) => {
  state = (state * 16807) % 2147483647;
  return min + ((state - 1) / 2147483646) * (max - min);
 };
}

function buildPieces() {
 const random = createRandom(WIN_BURST_SEED);
 const coins = Array.from({ length: WIN_BURST_COIN_COUNT }, (_, i) => {
  const depth = DEPTHS[i % 3];
  return {
   depth,
   size: random(19, 26) * depth,
   opacity: 0.5 + 0.5 * depth,
   delay: 0.12 + (i / WIN_BURST_COIN_COUNT) * 0.3 + random(0, 0.03),
   duration: 0.88,
   target: { x: random(-12, 12), y: random(-5, 5) },
   control: { x: random(-175, 185), y: -random(190, 330) * (0.6 + 0.4 * depth) },
   rotation: random(-60, 60),
   spin: (random(0, 1) < 0.5 ? -1 : 1) * random(60, 120),
  };
 });
 const bits = Array.from(
  { length: WIN_BURST_SPARK_COUNT + WIN_BURST_CONFETTI_COUNT },
  (_, i) => {
   const isSpark = i < WIN_BURST_SPARK_COUNT;
   const depth = DEPTHS[Math.floor(random(0, 3))];
   const base = isSpark ? random(8, 12) : random(6, 9);
   const angle = random(-Math.PI + 0.2, -0.2);
   const speed = random(200, 340) * (0.55 + 0.45 * depth);
   return {
    isSpark,
    depth,
    width: base * depth,
    height: isSpark ? base * depth : base * depth * 0.45,
    color: WIN_CONFETTI_COLORS[i % WIN_CONFETTI_COLORS.length],
    opacity: 0.45 + 0.55 * depth,
    delay: 0.08 + random(0, 0.08),
    life: random(0.85, 1.1),
    velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
    rotation: random(-90, 90),
    spin: (random(0, 1) < 0.5 ? -1 : 1) * random(90, 200),
   };
  },
 );
 const streaks = Array.from({ length: WIN_BURST_STREAK_COUNT }, (_, i) => ({
  angle: (i / WIN_BURST_STREAK_COUNT) * 2 * Math.PI + random(-0.12, 0.12),
  delay: random(0, 0.4),
  life: random(0.5, 0.65),
  reach: random(100, 140),
 }));
 const pops = Array.from({ length: WIN_BURST_POP_COUNT }, (_, i) => ({
  size: random(8, 12),
  angle: (i / WIN_BURST_POP_COUNT) * 2 * Math.PI + random(-0.2, 0.2),
  radius: random(60, 95),
 }));
 const layered = [
  ...coins.map((coin) => ({ coin, bit: undefined })),
  ...bits.map((bit) => ({ coin: undefined, bit })),
 ].sort((a, b) => (a.coin ?? a.bit)!.depth - (b.coin ?? b.bit)!.depth);
 return { coins, streaks, pops, layered };
}

const place = (
 el: HTMLElement | null,
 x: number,
 y: number,
 width: number,
 height: number,
 deg: number,
 scale: number,
 opacity: number,
) => {
 if (!el) return;
 el.style.transform = `translate3d(${x - width / 2}px,${y - height / 2}px,0) rotate(${deg}deg) scale(${scale})`;
 el.style.opacity = String(opacity);
};

const placeLine = (
 el: HTMLElement | null,
 x: number,
 y: number,
 length: number,
 thickness: number,
 deg: number,
 opacity: number,
) => {
 if (!el) return;
 el.style.transform = `translate3d(${x - LINE_BASE / 2}px,${y - 1}px,0) rotate(${deg}deg) scale(${Math.max(length, 0.01) / LINE_BASE},${thickness / 2})`;
 el.style.opacity = String(opacity);
};

export default function WinBurst({ originRef, targetRef }: IWinBurstProps) {
 const pieces = useMemo(buildPieces, []);
 const streakEls = useRef<(HTMLDivElement | null)[]>([]);
 const coinEls = useRef<(HTMLDivElement | null)[]>([]);
 const trailEls = useRef<(HTMLDivElement | null)[]>([]);
 const bitEls = useRef<(HTMLDivElement | null)[]>([]);
 const popEls = useRef<(HTMLDivElement | null)[]>([]);
 const glowEl = useRef<HTMLDivElement | null>(null);

 useEffect(() => {
  const { coins, streaks, pops, layered } = pieces;
  const firstLanding = Math.min(...coins.map((c) => c.delay + c.duration));
  const lastLanding = Math.max(...coins.map((c) => c.delay + c.duration));
  const landedAt = 1.5;
  let origin: { x: number; y: number } | null = null;
  let target: { x: number; y: number; width: number; height: number } | null =
   null;
  let raf = 0;
  const start = performance.now();

  const measure = () => {
   const o = originRef.current?.getBoundingClientRect();
   const t = targetRef.current?.getBoundingClientRect();
   if (!o || !t) return;
   origin = { x: o.left + o.width / 2, y: o.top + o.height / 2 };
   target = {
    x: t.left + t.width / 2,
    y: t.top + t.height / 2,
    width: t.width,
    height: t.height,
   };
   if (glowEl.current) {
    glowEl.current.style.width = `${t.width}px`;
    glowEl.current.style.height = `${t.height}px`;
   }
  };

  const tick = (now: number) => {
   const time = (now - start) / 1000;
   const t = time - WIN_BURST_LEAD_S;
   if (t >= 0 && !origin) measure();
   if (origin && target) {
    const o = origin;
    const tc = target;
    streaks.forEach((s, i) => {
     const p = clamp01((t - s.delay) / s.life);
     const eased = p * p;
     const radius = 48 + s.reach * eased;
     const length = 4 + 34 * eased;
     const opacity =
      t < s.delay ? 0 : 0.5 * smoothStep(p / 0.12) * (1 - smoothStep((p - 0.6) / 0.4));
     placeLine(
      streakEls.current[i],
      o.x + Math.cos(s.angle) * (radius - length / 2),
      o.y + Math.sin(s.angle) * (radius - length / 2),
      length,
      0.6 + 0.8 * p,
      (s.angle * 180) / Math.PI,
      opacity,
     );
    });

    layered.forEach(({ coin, bit }, i) => {
     if (coin) {
      const control = {
       x: Math.max(20, Math.min(window.innerWidth - 20, o.x + coin.control.x)),
       y: o.y + coin.control.y,
      };
      const end = { x: tc.x + coin.target.x, y: tc.y + coin.target.y };
      const u = (t - coin.delay) / coin.duration;
      const rotation = coin.rotation + coin.spin * Math.max(0, t - coin.delay);
      let x = o.x;
      let y = o.y;
      let scale = 0.3;
      let opacity = 0;
      let envelope = 0;
      if (u >= 1) {
       const a = smoothStep((t - coin.delay - coin.duration) / 0.14);
       x = end.x + (tc.x - end.x) * a;
       y = end.y + (tc.y - end.y) * a;
       scale = 0.55 - 0.5 * a;
       opacity = coin.opacity * (1 - a);
      } else if (u > 0) {
       const m = 1 - u;
       x = m * m * o.x + 2 * m * u * control.x + u * u * end.x;
       y = m * m * o.y + 2 * m * u * control.y + u * u * end.y;
       scale = 0.3 + 0.7 * smoothStep(u / 0.25) - 0.45 * smoothStep((u - 0.7) / 0.3);
       opacity = coin.opacity * smoothStep(u / 0.1);
       envelope = smoothStep(u / 0.12) * smoothStep((1 - u) / 0.12);
      }
      const uu = Math.max(0.001, Math.min(0.999, u));
      const mm = 1 - uu;
      const dx = 2 * mm * (control.x - o.x) + 2 * uu * (end.x - control.x);
      const dy = 2 * mm * (control.y - o.y) + 2 * uu * (end.y - control.y);
      const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
      const length =
       Math.min(84, (Math.hypot(dx, dy) / coin.duration) * 0.07) * coin.depth * envelope;
      const rad = (deg * Math.PI) / 180;
      placeLine(
       trailEls.current[i],
       x - (Math.cos(rad) * length) / 2,
       y - (Math.sin(rad) * length) / 2,
       length,
       2 * coin.depth + 0.4,
       deg,
       0.8 * coin.opacity * envelope,
      );
      place(coinEls.current[i], x, y, coin.size, coin.size, rotation, scale, opacity);
     } else if (bit) {
      const tt = t - bit.delay;
      if (tt <= 0) {
       place(bitEls.current[i], o.x, o.y, bit.width, bit.height, bit.rotation, 0.15, 0);
       return;
      }
      const drift = (1 - Math.exp(-3 * tt)) / 3;
      place(
       bitEls.current[i],
       o.x + bit.velocity.x * drift,
       o.y + bit.velocity.y * drift + 130 * tt * tt,
       bit.width,
       bit.height,
       bit.rotation + bit.spin * tt,
       0.4 + 0.6 * smoothStep(tt / 0.12),
       bit.opacity * smoothStep(tt / 0.08) * smoothStep((bit.life - tt) / 0.35),
      );
     }
    });

    const glowScale =
     t < landedAt
      ? 0.97 + 0.08 * smoothStep((t - firstLanding) / (lastLanding - firstLanding + 0.1))
      : 1.05 + 0.15 * easeOutCubic((t - landedAt) / 0.9);
    const glowOpacity =
     t < landedAt
      ? smoothStep((t - (firstLanding - 0.15)) / 0.3)
      : 1 - smoothStep((t - 1.6) / 0.7);
    place(glowEl.current, tc.x, tc.y, tc.width, tc.height, 0, glowScale, glowOpacity);

    pops.forEach((pop, i) => {
     const q = clamp01((t - landedAt) / 0.9);
     const reach = pop.radius * (easeOutCubic(q / 0.45) + 0.3 * q);
     place(
      popEls.current[i],
      tc.x + Math.cos(pop.angle) * reach,
      tc.y + Math.sin(pop.angle) * reach * 0.6,
      pop.size,
      pop.size,
      45 + 40 * q,
      0.2 + 0.8 * smoothStep(q / 0.2) - 0.6 * smoothStep((q - 0.5) / 0.5),
      t < landedAt ? 0 : smoothStep(q / 0.12) * (1 - smoothStep((q - 0.45) / 0.55)),
     );
    });
   }
   if (time < WIN_BURST_LEAD_S + WIN_BURST_END_S) raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
 }, [pieces, originRef, targetRef]);

 return createPortal(
  <Box customClass="win-burst" aria-hidden>
   {pieces.streaks.map((_, i) => (
    <Box
     key={`streak-${i}`}
     ref={(el: HTMLDivElement | null) => {
      streakEls.current[i] = el;
     }}
     customClass="win-burst-piece win-burst-streak"
    />
   ))}
   <Box ref={glowEl} customClass="win-burst-piece win-burst-glow" />
   {pieces.layered.map(({ coin, bit }, i) =>
    coin ? (
     <Box key={`coin-${i}`} customClass="win-burst-coin-wrap">
      <Box
       ref={(el: HTMLDivElement | null) => {
        trailEls.current[i] = el;
       }}
       customClass="win-burst-piece win-burst-trail"
       sx={{ height: 2 }}
      />
      <Box
       ref={(el: HTMLDivElement | null) => {
        coinEls.current[i] = el;
       }}
       customClass="win-burst-piece win-burst-coin"
       sx={{ width: coin.size, height: coin.size }}
      />
     </Box>
    ) : (
     <Box
      key={`bit-${i}`}
      ref={(el: HTMLDivElement | null) => {
       bitEls.current[i] = el;
      }}
      customClass={classNames(
       "win-burst-piece",
       bit!.isSpark ? "win-burst-spark" : "win-burst-confetti",
      )}
      sx={{
       width: bit!.width,
       height: bit!.height,
       ...(bit!.isSpark ? {} : { backgroundColor: bit!.color }),
      }}
     />
    ),
   )}
   {pieces.pops.map((pop, i) => (
    <Box
     key={`pop-${i}`}
     ref={(el: HTMLDivElement | null) => {
      popEls.current[i] = el;
     }}
     customClass="win-burst-piece win-burst-spark"
     sx={{ width: pop.size, height: pop.size }}
    />
   ))}
  </Box>,
  document.body,
 );
}
