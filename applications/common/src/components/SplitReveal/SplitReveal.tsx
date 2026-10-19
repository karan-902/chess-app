import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import {
 SPLIT_REVEAL_PRESS_MS,
 SPLIT_REVEAL_SHORT_MS,
 SPLIT_REVEAL_LONG_MS,
 SPLIT_REVEAL_TARGET_TIMEOUT_MS,
 SPLIT_REVEAL_DEBRIS_COUNT,
 SPLIT_REVEAL_TOOTH_PX,
 SPLIT_REVEAL_TEAR_VIBRATE,
 SPLIT_REVEAL_LAND_VIBRATE_MS,
} from "@gopvp/common/src/constants/limit";
import type { ISplitRevealProps } from "@gopvp/common/src/types/component";

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const FLIGHT_MS = SPLIT_REVEAL_LONG_MS + SPLIT_REVEAL_SHORT_MS;
const SETTLE_MS = FLIGHT_MS + SPLIT_REVEAL_PRESS_MS;

const DEBRIS = Array.from({ length: SPLIT_REVEAL_DEBRIS_COUNT }, (_, i) => {
 const side = i % 2 ? 1 : -1;
 return {
  isFibre: i % 3 !== 0,
  left: 5 + ((i * 17.3) % 90),
  dx: side * (16 + ((i * 23) % 70)),
  dy: -(18 + ((i * 29) % 46)),
  rotation: side * (40 + ((i * 31) % 160)),
 };
});

const tearEdge = (width: number, y: number) =>
 Array.from(
  { length: Math.ceil(width / SPLIT_REVEAL_TOOTH_PX) + 1 },
  (_, i) =>
   `${Math.min(i * SPLIT_REVEAL_TOOTH_PX, width)}px ${y + (i % 2 ? 4 : -4)}px`,
 );

const findTarget = (isCancelled: () => boolean) =>
 new Promise<DOMRect | null>((resolve) => {
  const deadline = performance.now() + SPLIT_REVEAL_TARGET_TIMEOUT_MS;
  const tick = (now: number) => {
   const rect = document
    .querySelector("[data-reveal-target]")
    ?.getBoundingClientRect();
   if (rect?.width) resolve(rect);
   else if (now > deadline || isCancelled()) resolve(null);
   else requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
 });

export default function SplitReveal({
 ticket,
 Surface,
 onDone,
}: ISplitRevealProps) {
 const backdropRef = useRef<HTMLDivElement>(null);
 const ticketRef = useRef<HTMLDivElement>(null);
 const topRef = useRef<HTMLDivElement>(null);
 const bottomRef = useRef<HTMLDivElement>(null);
 const leakRef = useRef<HTMLDivElement>(null);
 const surfaceRef = useRef<HTMLDivElement>(null);
 const debrisRefs = useRef<(HTMLDivElement | null)[]>([]);
 const animations = useRef<Animation[]>([]);
 const isTorn = useRef(false);
 const { node, rect, tearY } = ticket;

 useEffect(() => {
  const backdrop = backdropRef.current;
  const ticketEl = ticketRef.current;
  const top = topRef.current;
  const bottom = bottomRef.current;
  const leak = leakRef.current;
  const surface = surfaceRef.current;
  if (!backdrop || !ticketEl || !top || !bottom || !leak || !surface) return;
  let isCancelled = false;

  top.replaceChildren(node);
  bottom.replaceChildren(node.cloneNode(true));
  const edge = tearEdge(rect.width, tearY);
  top.style.clipPath = `polygon(0 0, ${rect.width}px 0, ${[...edge].reverse().join(",")})`;
  bottom.style.clipPath = `polygon(${edge.join(",")}, ${rect.width}px ${rect.height}px, 0 ${rect.height}px)`;

  const run = (
   el: Element,
   frames: Keyframe[],
   options: KeyframeAnimationOptions,
  ) => {
   const animation = el.animate(frames, { fill: "forwards", ...options });
   animations.current.push(animation);
   return animation;
  };

  const tear = (target: DOMRect) => {
   isTorn.current = true;
   navigator.vibrate?.(SPLIT_REVEAL_TEAR_VIBRATE);
   run(backdrop, [{ opacity: 0.8 }, { opacity: 1 }], {
    duration: SPLIT_REVEAL_SHORT_MS,
    easing: EASE_OUT,
   });
   run(leak, [{ opacity: 1 }, { opacity: 0 }], {
    duration: SPLIT_REVEAL_PRESS_MS,
    easing: EASE_OUT,
   });
   DEBRIS.forEach(({ dx, dy, rotation }, i) => {
    const bit = debrisRefs.current[i];
    if (!bit) return;
    run(
     bit,
     [
      {
       opacity: 1,
       transform: "translate(0, 0) rotate(0)",
       easing: "cubic-bezier(0.2, 0.7, 0.5, 1)",
      },
      {
       opacity: 1,
       transform: `translate(${dx * 0.7}px, ${dy}px) rotate(${rotation * 0.5}deg)`,
       offset: 0.35,
       easing: "cubic-bezier(0.5, 0, 0.8, 0.5)",
      },
      {
       opacity: 0,
       transform: `translate(${dx}px, ${dy + 130}px) rotate(${rotation}deg)`,
      },
     ],
     { duration: SPLIT_REVEAL_LONG_MS },
    );
   });
   run(
    top,
    [
     { transform: "none", easing: "cubic-bezier(0.2, 0.6, 0.4, 1)" },
     {
      transform: "translate(-10px, -34px) rotate(-3deg) scale(1.04)",
      offset: 0.3,
      easing: "cubic-bezier(0.55, 0, 0.85, 0.4)",
     },
     { opacity: 1, offset: 0.85 },
     {
      opacity: 0,
      transform: "translate(-90px, 560px) rotate(-18deg) scale(1.3)",
     },
    ],
    { duration: FLIGHT_MS },
   );
   run(
    bottom,
    [
     { transform: "none", easing: "cubic-bezier(0.15, 0.7, 0.5, 0.9)" },
     {
      transform: "translate(4px, 70px) rotate(3deg) scale(1.04)",
      offset: 0.3,
      easing: "cubic-bezier(0.4, 0.1, 0.8, 0.5)",
     },
     { opacity: 1, offset: 0.85 },
     {
      opacity: 0,
      transform: "translate(90px, 520px) rotate(18deg) scale(1.3)",
     },
    ],
    { duration: FLIGHT_MS },
   );

   Object.assign(surface.style, {
    left: `${target.left}px`,
    top: `${target.top}px`,
    width: `${target.width}px`,
    height: `${target.height}px`,
   });
   const dx = rect.left + rect.width / 2 - (target.left + target.width / 2);
   const dy = rect.top + tearY - (target.top + target.height / 2);
   run(surface, [{ opacity: 0 }, { opacity: 1 }], {
    duration: SPLIT_REVEAL_SHORT_MS,
    easing: EASE_OUT,
   });
   run(
    surface,
    [
     {
      transform: `translate(${dx}px, ${dy}px) perspective(50rem) rotateX(38deg) scale(0.3)`,
      easing: "cubic-bezier(0.2, 0.7, 0.5, 0.95)",
     },
     {
      transform: `translate(${dx}px, ${dy}px) perspective(50rem) rotateX(24deg) scale(0.46)`,
      offset: 0.4,
      easing: "cubic-bezier(0.4, 0.15, 0.2, 1)",
     },
     {
      transform: "translate(0, 0) perspective(50rem) rotateX(0deg) scale(1)",
     },
    ],
    { duration: SETTLE_MS },
   )
    .finished.then(() => navigator.vibrate?.(SPLIT_REVEAL_LAND_VIBRATE_MS))
    .catch(() => {});

   const fadeOut = {
    duration: SPLIT_REVEAL_SHORT_MS,
    delay: SETTLE_MS - SPLIT_REVEAL_PRESS_MS,
    easing: EASE_OUT,
   };
   run(backdrop, [{ opacity: 1 }, { opacity: 0 }], fadeOut);
   run(surface, [{ opacity: 1 }, { opacity: 0 }], fadeOut)
    .finished.then(() => !isCancelled && onDone())
    .catch(() => {});
  };

  run(backdrop, [{ opacity: 0 }, { opacity: 0.8 }], {
   duration: SPLIT_REVEAL_SHORT_MS,
   easing: EASE_OUT,
  });
  run(
   leak,
   [
    { opacity: 0, transform: "scaleX(0.3)" },
    { opacity: 1, transform: "scaleX(1.1)" },
   ],
   { duration: SPLIT_REVEAL_SHORT_MS, easing: EASE_OUT },
  );
  const swell = run(
   ticketEl,
   [
    { transform: "translateX(0) scale(1)", easing: EASE_OUT },
    { transform: "translateX(0) scale(1.04)", offset: 0.78 },
    { transform: "translateX(-1px) scale(1.04)", offset: 0.86 },
    { transform: "translateX(1px) scale(1.04)", offset: 0.93 },
    { transform: "translateX(0) scale(1.04)" },
   ],
   { duration: SPLIT_REVEAL_SHORT_MS },
  );

  Promise.all([swell.finished, findTarget(() => isCancelled)])
   .then(([, target]) => {
    if (isCancelled) return;
    if (target) tear(target);
    else onDone();
   })
   .catch(() => {});

  return () => {
   isCancelled = true;
   animations.current.forEach((animation) => animation.cancel());
   animations.current = [];
   top.replaceChildren();
   bottom.replaceChildren();
  };
 }, [node, rect, tearY, onDone]);

 const skip = () => {
  if (isTorn.current)
   animations.current.forEach((animation) => animation.finish());
 };

 return createPortal(
  <Box customClass="split-reveal" aria-hidden onPointerDown={skip}>
   <Box ref={backdropRef} customClass="split-reveal-backdrop" />
   <Box
    ref={ticketRef}
    customClass="split-reveal-ticket"
    sx={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
   >
    <Box ref={bottomRef} customClass="split-reveal-half" />
    <Box ref={topRef} customClass="split-reveal-half" />
    <Box ref={leakRef} customClass="split-reveal-leak" sx={{ top: tearY }} />
    {DEBRIS.map(({ isFibre, left }, i) => (
     <Box
      key={i}
      ref={(el: HTMLDivElement | null) => {
       debrisRefs.current[i] = el;
      }}
      customClass={classNames("split-reveal-debris", isFibre && "fibre")}
      sx={{ left: `${left}%`, top: tearY }}
     />
    ))}
   </Box>
   <Box ref={surfaceRef} customClass="split-reveal-surface">
    <Surface />
   </Box>
  </Box>,
  document.body,
 );
}
