import CanvasAnimation from "@gopvp/common/src/components/CanvasAnimation/CanvasAnimation";
import type { ISpinnerProps } from "@gopvp/common/src/types/component";

export default function Spinner({
 periodMs,
 reducedPeriodMs,
 ...props
}: ISpinnerProps) {
 return (
  <CanvasAnimation
   {...props}
   draw={(ctx, { elapsed, width, style, isReducedMotion }) => {
    const period = isReducedMotion ? reducedPeriodMs : periodMs;
    const turn = period ? (elapsed / period) * Math.PI * 2 : 0;
    const center = width / 2;
    ctx.lineWidth = parseFloat(style.strokeWidth);
    const radius = center - ctx.lineWidth / 2;
    if (style.stroke !== "none") {
     ctx.strokeStyle = style.stroke;
     ctx.globalAlpha = parseFloat(style.strokeOpacity);
     ctx.beginPath();
     ctx.arc(center, center, radius, 0, Math.PI * 2);
     ctx.stroke();
     ctx.globalAlpha = 1;
    }
    ctx.strokeStyle = style.color;
    ctx.beginPath();
    ctx.arc(
     center,
     center,
     radius,
     turn - Math.PI * 0.75,
     turn - Math.PI * 0.25,
    );
    ctx.stroke();
    return Boolean(period);
   }}
  />
 );
}
