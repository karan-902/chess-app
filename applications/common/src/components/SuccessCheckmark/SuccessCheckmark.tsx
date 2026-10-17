import { useEffect, useRef } from "react";
import classNames from "classnames";
import { icons, coinImage } from "@gopvp/common/src/components/images";
import {
 SUCCESS_COIN_COUNT,
 SUCCESS_COIN_BURST_MS,
 SUCCESS_COIN_DELAY_MS,
} from "@gopvp/common/src/constants/limit";
import "./success-checkmark.scss";

interface ISuccessCheckmarkProps {
 customClass?: string;
}

const BURST_COINS = Array.from({ length: SUCCESS_COIN_COUNT }, (_, i) => {
 const angle = (i / SUCCESS_COIN_COUNT) * Math.PI * 2 - Math.PI / 2;
 const distance = 62 + (i % 3) * 12;
 return {
  x: Math.cos(angle) * distance,
  y: Math.sin(angle) * distance,
  spin: (i % 2 ? 1 : -1) * (160 + (i % 3) * 40),
  size: 14 + (i % 3) * 4,
  delay: SUCCESS_COIN_DELAY_MS + (i % 4) * 30,
 };
});

export function SuccessCheckmark({ customClass }: ISuccessCheckmarkProps) {
 const coinRefs = useRef<(HTMLImageElement | null)[]>([]);

 useEffect(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const animations = BURST_COINS.map(({ x, y, spin, delay }, i) =>
   coinRefs.current[i]?.animate(
    [
     {
      transform: "translate3d(0, 0, 0) scale(0.4) rotate(0deg)",
      opacity: 0,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
     },
     { opacity: 1, offset: 0.1 },
     {
      transform: `translate3d(${x}px, ${y - 18}px, 0) scale(1) rotate(${spin * 0.6}deg)`,
      opacity: 1,
      offset: 0.5,
      easing: "cubic-bezier(0.5, 0, 0.75, 0)",
     },
     {
      transform: `translate3d(${x * 1.15}px, ${y + 36}px, 0) scale(0.85) rotate(${spin}deg)`,
      opacity: 0,
     },
    ],
    { duration: SUCCESS_COIN_BURST_MS, delay, fill: "both" },
   ),
  );
  return () => animations.forEach((animation) => animation?.cancel());
 }, []);

 return (
  <div className={classNames("common-success-checkmark", customClass)}>
   <span className="success-glow" />
   {BURST_COINS.map(({ size }, i) => (
    <img
     key={i}
     ref={(el) => {
      coinRefs.current[i] = el;
     }}
     className="success-coin"
     src={coinImage}
     alt=""
     style={{ width: size, height: size, margin: -size / 2 }}
    />
   ))}
   <span className="success-badge">
    <icons.check />
   </span>
  </div>
 );
}

export default SuccessCheckmark;
