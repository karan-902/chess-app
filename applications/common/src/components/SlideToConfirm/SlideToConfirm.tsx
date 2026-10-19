import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";
import classNames from "classnames";
import { icons } from "@gopvp/common/src/components/images";
import { SLIDE_CONFIRM_THRESHOLD } from "@gopvp/common/src/constants/limit";
import type { ISlideToConfirmProps } from "@gopvp/common/src/types/component";
import "./slide-to-confirm.scss";

export function SlideToConfirm({
 label,
 onConfirm,
 isLoading = false,
 disabled = false,
 customClass,
}: ISlideToConfirmProps) {
 const trackRef = useRef<HTMLDivElement>(null);
 const knobRef = useRef<HTMLButtonElement>(null);
 const drag = useRef({ startX: 0, max: 0, offset: 0, active: false });
 const frame = useRef(0);

 const paint = (offset: number, animate: boolean) => {
  const track = trackRef.current;
  if (!track) return;
  track.classList.toggle("returning", animate);
  track.style.setProperty("--slide-offset", `${offset}px`);
  track.style.setProperty(
   "--slide-progress",
   String(drag.current.max ? offset / drag.current.max : 0),
  );
 };

 useEffect(() => {
  if (!isLoading) paint(0, true);
 }, [isLoading]);

 useEffect(() => () => cancelAnimationFrame(frame.current), []);

 const isLocked = disabled || isLoading;

 const handleDown = (e: PointerEvent<HTMLButtonElement>) => {
  const track = trackRef.current;
  const knob = knobRef.current;
  if (isLocked || !track || !knob) return;
  knob.setPointerCapture(e.pointerId);
  const trackStyle = getComputedStyle(track);
  drag.current = {
   startX: e.clientX,
   max:
    track.clientWidth -
    parseFloat(trackStyle.paddingLeft) -
    parseFloat(trackStyle.paddingRight) -
    parseFloat(getComputedStyle(knob).width),
   offset: 0,
   active: true,
  };
 };

 const handleMove = (e: PointerEvent<HTMLButtonElement>) => {
  if (!drag.current.active) return;
  const { startX, max } = drag.current;
  drag.current.offset = Math.min(Math.max(e.clientX - startX, 0), max);
  cancelAnimationFrame(frame.current);
  frame.current = requestAnimationFrame(() =>
   paint(drag.current.offset, false),
  );
 };

 const handleUp = () => {
  if (!drag.current.active) return;
  drag.current.active = false;
  cancelAnimationFrame(frame.current);
  const { offset, max } = drag.current;
  if (max && offset / max >= SLIDE_CONFIRM_THRESHOLD) {
   paint(max, true);
   onConfirm();
  } else paint(0, true);
 };

 return (
  <div
   ref={trackRef}
   className={classNames(
    "common-slide-confirm",
    isLocked && "locked",
    isLoading && "loading",
    customClass,
   )}
  >
   <span className="slide-confirm-label">{label}</span>
   <button
    ref={knobRef}
    type="button"
    className="slide-confirm-knob"
    aria-label={label}
    disabled={isLocked}
    onPointerDown={handleDown}
    onPointerMove={handleMove}
    onPointerUp={handleUp}
    onPointerCancel={handleUp}
    onLostPointerCapture={handleUp}
    onClick={(e) => {
     if (e.detail === 0) onConfirm();
    }}
   >
    {isLoading ? (
     <span className="slide-confirm-spinner" />
    ) : (
     <icons.moveRight />
    )}
   </button>
  </div>
 );
}

export default SlideToConfirm;
