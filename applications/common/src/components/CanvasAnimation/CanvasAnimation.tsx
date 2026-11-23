import { useEffect, useRef } from "react";
import classNames from "classnames";
import { CANVAS_MAX_FRAME_MS } from "@gopvp/common/src/constants/limit";
import type { ICanvasAnimationProps } from "@gopvp/common/src/types/component";
import "./canvas-animation.scss";

export default function CanvasAnimation({
 draw,
 isPaused = false,
 customClass,
 ...props
}: ICanvasAnimationProps) {
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const latest = useRef({ draw, isPaused });
 latest.current = { draw, isPaused };

 useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;
  const style = getComputedStyle(canvas);
  let lastNow = performance.now();
  let elapsed = 0;
  let isOnScreen = true;
  let frame = 0;
  let width = 0;
  let height = 0;

  const paint = () => {
   const dpr = window.devicePixelRatio;
   ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
   ctx.clearRect(0, 0, width, height);
   const frameData = { elapsed, width, height, style };
   return latest.current.draw(ctx, frameData);
  };

  const tick = (now: number) => {
   const isRunning = isOnScreen && !latest.current.isPaused;
   if (isRunning)
    elapsed += Math.min(Math.max(now - lastNow, 0), CANVAS_MAX_FRAME_MS);
   lastNow = now;
   if (!isRunning || paint()) frame = requestAnimationFrame(tick);
  };

  const resizeObserver = new ResizeObserver(([entry]) => {
   ({ width, height } = entry.contentRect);
   canvas.width = Math.round(width * window.devicePixelRatio);
   canvas.height = Math.round(height * window.devicePixelRatio);
   cancelAnimationFrame(frame);
   if (paint()) frame = requestAnimationFrame(tick);
  });
  const intersectionObserver = new IntersectionObserver(([entry]) => {
   isOnScreen = entry.isIntersecting;
  });
  resizeObserver.observe(canvas);
  intersectionObserver.observe(canvas);

  return () => {
   resizeObserver.disconnect();
   intersectionObserver.disconnect();
   cancelAnimationFrame(frame);
  };
 }, []);

 return (
  <canvas
   ref={canvasRef}
   className={classNames("common-canvas-animation", customClass)}
   {...props}
  />
 );
}
