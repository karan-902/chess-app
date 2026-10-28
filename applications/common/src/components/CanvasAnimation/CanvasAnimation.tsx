import { useEffect, useRef } from "react";
import classNames from "classnames";
import { shouldReduceMotion } from "@gopvp/common/src/util/motion";
import type { ICanvasAnimationProps } from "@gopvp/common/src/types/component";
import "./canvas-animation.scss";

export default function CanvasAnimation({
 draw,
 customClass,
 ...props
}: ICanvasAnimationProps) {
 const canvasRef = useRef<HTMLCanvasElement>(null);
 const drawRef = useRef(draw);
 drawRef.current = draw;

 useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;
  const style = getComputedStyle(canvas);
  const isReducedMotion = shouldReduceMotion();
  const start = performance.now();
  let frame = 0;
  let width = 0;
  let height = 0;

  const render = (now: number) => {
   const dpr = window.devicePixelRatio;
   ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
   ctx.clearRect(0, 0, width, height);
   const frameData = {
    elapsed: now - start,
    width,
    height,
    style,
    isReducedMotion,
   };
   if (drawRef.current(ctx, frameData)) frame = requestAnimationFrame(render);
  };

  const observer = new ResizeObserver(([entry]) => {
   ({ width, height } = entry.contentRect);
   canvas.width = Math.round(width * window.devicePixelRatio);
   canvas.height = Math.round(height * window.devicePixelRatio);
   cancelAnimationFrame(frame);
   render(performance.now());
  });
  observer.observe(canvas);

  return () => {
   observer.disconnect();
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
