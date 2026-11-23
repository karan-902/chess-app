import { useRef } from "react";
import CanvasAnimation from "@gopvp/common/src/components/CanvasAnimation/CanvasAnimation";
import { SPARK_PATH } from "@gopvp/common/src/components/constants";
import { RIVAL_MASK_PATH } from "@gopvp/app/src/constants/asset";
import {
 matchTicketText,
 matchConfirmedText,
 noMatchFoundText,
 noMatchText,
 rivalText,
 noRivalText,
 vsText,
} from "@gopvp/app/src/constants/message";
import type {
 IMatchTicketProps,
 IMatchTicketStat,
} from "@gopvp/app/src/types/component";
import type {
 ICanvasAnimationProps,
 ICanvasFrame,
 ISplitRevealTicket,
} from "@gopvp/common/src/types/component";

type TPhase = "searching" | "found" | "lost";

interface ITicketScene {
 phase: TPhase;
 foundAt: { current: number | null };
 title: string;
 myName: string;
 rivalName: string;
 chip?: string;
 stats: IMatchTicketStat[];
}

const BOX_WIDTH = 20.9375;
const RISE_HEIGHT = 16.25;
const WRAP = { x: 4.21875, y: 3.25, width: 12.5, height: 11 };
const NOTCH = { y: 6.5, radius: 0.5 };
const STUB_HEIGHT = 1.875;
const SEAT_RADIUS = 1.375;
const SEAT_Y = 3.5;
const SLOT = { x: 3.875, y: 16.125, width: 13.1875, height: 0.625 };
const SPARKS = [
 { x: 13.9375, y: 5.25, size: 1, delay: 500 },
 { x: 3.5, y: 6, size: 0.6875, delay: 580 },
 { x: 17.25, y: 10.625, size: 0.5625, delay: 660 },
 { x: 2.5, y: 12.5, size: 0.625, delay: 740 },
];

const TEAR_DIPS = [58.15, 55.71, 58.15, 54.89, 58.97, 54.89];
const TEAR_EDGE = Array.from({ length: 26 }, (_, k) => [
 99.43 - k * 3.977,
 TEAR_DIPS[k % TEAR_DIPS.length],
]);
const BOTTOM_EDGE = Array.from({ length: 30 }, (_, k) => [
 98.86 - k * 3.409,
 k % 2 ? 95.65 : 100,
]);
const SHAPES = {
 whole: [[0, 0], [100, 0], ...BOTTOM_EDGE],
 top: [[0, 0], [100, 0], ...TEAR_EDGE],
 bottom: [...[...TEAR_EDGE].reverse(), ...BOTTOM_EDGE],
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const progress = (t: number, delay: number, duration: number) =>
 clamp01((t - delay) / duration);

const cubicBezier =
 (x1: number, y1: number, x2: number, y2: number) => (x: number) => {
  let t = clamp01(x);
  for (let i = 0; i < 8; i++) {
   const u = 1 - t;
   const slope = 3 * x1 * u * u + 6 * (x2 - x1) * u * t + 3 * (1 - x2) * t * t;
   if (Math.abs(slope) < 1e-6) break;
   t = clamp01(
    t - (3 * x1 * u * u * t + 3 * x2 * u * t * t + t ** 3 - x) / slope,
   );
  }
  const u = 1 - t;
  return 3 * y1 * u * u * t + 3 * y2 * u * t * t + t ** 3;
 };

const EASE = cubicBezier(0.25, 0.1, 0.25, 1);
const EASE_OUT = cubicBezier(0, 0, 0.58, 1);
const EASE_IN_OUT = cubicBezier(0.42, 0, 0.58, 1);
const RISE_EASE = cubicBezier(0.16, 1, 0.3, 1);
const POP_EASE = cubicBezier(0.33, 1, 0.68, 1);
const TEAR_EASE = cubicBezier(0.2, 0.8, 0.2, 1);
const FLIP_EASE = cubicBezier(0.45, 0, 0.2, 1);
const THUD_EASE = cubicBezier(0.3, 1.4, 0.5, 1);
const SPARK_EASE = cubicBezier(0.34, 1.4, 0.64, 1);

const keyframes = (
 p: number,
 frames: number[][],
 ease: (p: number) => number,
) => {
 const next = Math.max(
  frames.findIndex(([at]) => at >= p),
  1,
 );
 const from = frames[next - 1];
 const to = frames[next];
 const local = ease(clamp01((p - from[0]) / (to[0] - from[0])));
 return from.slice(1).map((value, i) => lerp(value, to[i + 1], local));
};

const maskImage = new Image();
maskImage.src = RIVAL_MASK_PATH;
const sparkShape = new Path2D(SPARK_PATH);
const timerShape = new Path2D(
 "M10 2h4M12 14l3-3M20 14a8 8 0 1 1-16 0a8 8 0 1 1 16 0",
);

const withAlpha = (
 ctx: CanvasRenderingContext2D,
 color: string,
 alpha: number,
) => {
 ctx.fillStyle = color;
 return `${ctx.fillStyle}${Math.round(clamp01(alpha) * 255)
  .toString(16)
  .padStart(2, "0")}`;
};

const drawTicket = (
 ctx: CanvasRenderingContext2D,
 { elapsed: t, width, style }: ICanvasFrame,
 { phase, foundAt, title, myName, rivalName, chip, stats }: ITicketScene,
) => {
 if (phase !== "found") foundAt.current = null;
 else foundAt.current ??= t;
 const sinceFound = foundAt.current === null ? 0 : t - foundAt.current;
 const isFound = phase === "found";
 const isLost = phase === "lost";
 const scale = width / BOX_WIDTH;
 const css = (name: string) => style.getPropertyValue(name).trim();
 const ink = css("--ticket-ink");
 const gold = css("--ticket-gold");
 const paperTop = css("--ticket-paper-top");
 const boldFont = style.fontFamily;
 const heavyFont = css("--ticket-heavy-font");
 const maskColors = [1, 2, 3, 4].map((i) => css(`--ticket-mask-${i}`));

 const setFont = (family: string, size: number) => {
  ctx.font = `${size * scale}px ${family}`;
 };
 const measure = (text: string) => ctx.measureText(text).width / scale;
 const fillText = (text: string, x: number, y: number) => {
  ctx.save();
  ctx.scale(1 / scale, 1 / scale);
  ctx.fillText(text, x * scale, y * scale);
  ctx.restore();
 };
 const spacedWidth = (text: string, spacing: number) =>
  [...text].reduce((sum, char) => sum + measure(char) + spacing, -spacing);
 const fillSpaced = (
  text: string,
  x: number,
  y: number,
  spacing: number,
  anchor = 0.5,
 ) => {
  let left = x - spacedWidth(text, spacing) * anchor;
  [...text].forEach((char) => {
   fillText(char, left, y);
   left += measure(char) + spacing;
  });
 };
 const fitText = (text: string, maxWidth: number) => {
  if (measure(text) <= maxWidth) return text;
  let end = text.length;
  while (end > 0 && measure(`${text.slice(0, end)}…`) > maxWidth) end--;
  return `${text.slice(0, end)}…`;
 };
 const fillCircle = (x: number, y: number, radius: number) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
 };
 const drawAvatar = (name: string, x: number, y: number) => {
  ctx.fillStyle = ink;
  fillCircle(x, y, SEAT_RADIUS);
  ctx.fillStyle = gold;
  ctx.textAlign = "center";
  setFont(heavyFont, 1.375);
  fillText(name.charAt(0).toUpperCase(), x, y + 0.06);
  ctx.textAlign = "left";
 };

 const beamOpacity = isLost ? 1 - EASE_OUT(progress(t, 0, 800)) : 1;
 const slotGlow =
  phase === "searching"
   ? keyframes(
      (t % 1000) / 1000,
      [
       [0, 0],
       [0.5, 1],
       [1, 0],
      ],
      EASE_IN_OUT,
     )[0]
   : 0;
 const riseY = isLost ? 0 : 15 * (1 - RISE_EASE(progress(t, 300, 1800)));
 const [popY, popScale] = isFound
  ? keyframes(
     progress(sinceFound, 400, 700),
     [
      [0, 0, 1],
      [0.4, -0.5, 1.03],
      [1, 0, 1],
     ],
     POP_EASE,
    )
  : [0, 1];
 const [tugX, tugTurn] = isLost
  ? keyframes(
     progress(t, 1200, 320),
     [
      [0, 0, 0],
      [0.3, -0.125, -0.6],
      [0.65, 0.125, 0.6],
      [1, 0, 0],
     ],
     EASE_IN_OUT,
    )
  : [0, 0];
 const shadowOpacity = isLost ? 1 - EASE(progress(t, 1400, 300)) : 1;
 const [flipAngle, flipScale] = isFound
  ? keyframes(
     progress(sinceFound, 0, 750),
     [
      [0, 0, 1],
      [0.5, 90, 1.14],
      [1, 180, 1],
     ],
     FLIP_EASE,
    )
  : [0, 1];
 const maskIndex =
  phase === "searching" ? Math.floor(t / 700) % maskColors.length : 0;
 const masksOpacity = isLost ? 1 - 0.4 * EASE_OUT(progress(t, 0, 400)) : 1;
 const pendingOpacity =
  phase === "searching"
   ? 1
   : 1 - EASE(progress(isFound ? sinceFound : t, 0, 300));
 const confirmedShow = isFound ? EASE(progress(sinceFound, 0, 300)) : 0;
 const voidStubShow = isLost ? EASE(progress(t, 300, 300)) : 0;
 const dimOpacity = isLost ? EASE(progress(t, 300, 400)) : 0;
 const stampThud = THUD_EASE(progress(t, 600, 350));
 const tear = TEAR_EASE(progress(t, 1500, 800));
 const torn = 1 - 0.15 * EASE_OUT(progress(t, 2200, 500));

 const drawContent = () => {
  ctx.fillStyle = css("--ticket-stub");
  ctx.fillRect(0, 0, WRAP.width, STUB_HEIGHT);
  ctx.textBaseline = "middle";
  setFont(boldFont, 0.875);
  if (pendingOpacity > 0) {
   ctx.fillStyle = withAlpha(ctx, css("--ticket-stub-ink"), pendingOpacity);
   fillSpaced(title.toUpperCase(), WRAP.width / 2, STUB_HEIGHT / 2, 0.09375);
  }
  [
   {
    show: confirmedShow,
    fill: css("--ticket-confirmed"),
    text: matchConfirmedText,
    lift: 0.5,
   },
   {
    show: voidStubShow,
    fill: css("--ticket-void-stub"),
    text: noMatchFoundText,
    lift: 0,
   },
  ].forEach(({ show, fill, text, lift }) => {
   if (show <= 0) return;
   ctx.save();
   ctx.globalAlpha *= show;
   ctx.translate(0, lift * (1 - show));
   ctx.fillStyle = fill;
   ctx.fillRect(0, 0, WRAP.width, STUB_HEIGHT);
   ctx.fillStyle = ink;
   fillSpaced(text.toUpperCase(), WRAP.width / 2, STUB_HEIGHT / 2, 0.09375);
   ctx.restore();
  });

  setFont(heavyFont, 0.875);
  const vsHalf = spacedWidth(vsText.toUpperCase(), 0.0625) / 2;
  const sideOffset = vsHalf + 0.25 + 2.125;
  const meX = WRAP.width / 2 - sideOffset;
  const rivalX = WRAP.width / 2 + sideOffset;
  ctx.fillStyle = withAlpha(ctx, ink, 0.4);
  fillSpaced(vsText.toUpperCase(), WRAP.width / 2, 3.6, 0.0625);

  drawAvatar(myName, meX, SEAT_Y);
  ctx.save();
  ctx.translate(rivalX, SEAT_Y);
  ctx.scale(
   Math.abs(Math.cos((flipAngle * Math.PI) / 180)) * flipScale,
   flipScale,
  );
  if (flipAngle < 90) {
   ctx.globalAlpha *= masksOpacity;
   const inner = SEAT_RADIUS - 0.09375;
   ctx.fillStyle = maskColors[maskIndex];
   fillCircle(0, 0, inner);
   if (maskImage.naturalWidth)
    ctx.drawImage(maskImage, -inner, -inner, inner * 2, inner * 2);
   ctx.strokeStyle = withAlpha(ctx, ink, 0.35);
   ctx.lineWidth = 0.09375;
   ctx.setLineDash([0.28, 0.2]);
   ctx.beginPath();
   ctx.arc(0, 0, SEAT_RADIUS - 0.047, 0, Math.PI * 2);
   ctx.stroke();
   ctx.setLineDash([]);
  } else drawAvatar(rivalName, 0, 0);
  ctx.restore();

  setFont(boldFont, 0.875);
  ctx.textAlign = "center";
  [
   { name: myName, x: meX, alpha: 0.75 },
   { name: rivalName, x: rivalX, alpha: isFound ? 0.75 : 0.45 },
  ].forEach(({ name, x, alpha }) => {
   ctx.fillStyle = withAlpha(ctx, ink, alpha);
   fillText(fitText(name, 5.5), x, 5.8);
  });
  ctx.textAlign = "left";

  ctx.strokeStyle = withAlpha(ctx, ink, 0.3);
  ctx.lineWidth = 0.0625;
  ctx.setLineDash([0.1875, 0.125]);
  ctx.beginPath();
  ctx.moveTo(0.75, NOTCH.y);
  ctx.lineTo(WRAP.width - 0.75, NOTCH.y);
  ctx.stroke();
  ctx.setLineDash([]);

  if (chip) {
   const chipText = chip.toUpperCase();
   setFont(boldFont, 0.67);
   const chipWidth = 1.73 + spacedWidth(chipText, 0.056);
   const chipLeft = (WRAP.width - chipWidth) / 2;
   const chipY = NOTCH.y + 0.85;
   ctx.fillStyle = ink;
   ctx.beginPath();
   ctx.roundRect(chipLeft, chipY - 0.5, chipWidth, 1, 0.5);
   ctx.fill();
   ctx.save();
   ctx.translate(chipLeft + 0.45, chipY - 0.305);
   ctx.scale(0.61 / 24, 0.61 / 24);
   ctx.strokeStyle = paperTop;
   ctx.lineWidth = 2.5;
   ctx.lineCap = "round";
   ctx.stroke(timerShape);
   ctx.restore();
   ctx.fillStyle = paperTop;
   fillSpaced(chipText, chipLeft + 1.28, chipY + 0.03, 0.056, 0);
  }

  if (chip && stats.length === 2) {
   const valueBaseline = 9.75;
   ctx.textBaseline = "alphabetic";
   const [fromWidth, toWidth] = stats.map(({ label, value }, i) => {
    const labelText = label.toUpperCase();
    setFont(boldFont, 0.67);
    const labelWidth = spacedWidth(labelText, 0.056);
    setFont(heavyFont, 1);
    const blockWidth = Math.max(labelWidth, measure(value));
    const center = i
     ? WRAP.width - 0.95 - blockWidth / 2
     : 0.95 + blockWidth / 2;
    ctx.fillStyle = ink;
    fillSpaced(value, center, valueBaseline, 0);
    setFont(boldFont, 0.67);
    ctx.fillStyle = css("--ticket-muted");
    fillSpaced(labelText, center, valueBaseline - 1.07, 0.056);
    return blockWidth;
   });
   ctx.textBaseline = "middle";
   const trackY = valueBaseline - 0.35;
   const startX = 0.95 + fromWidth + 0.45;
   const endX = WRAP.width - 0.95 - toWidth - 0.45;
   ctx.fillStyle = ink;
   fillCircle(startX + 0.2, trackY, 0.2);
   ctx.strokeStyle = withAlpha(ctx, ink, 0.25);
   ctx.lineWidth = 0.11;
   ctx.setLineDash([0.33, 0.22]);
   ctx.beginPath();
   ctx.moveTo(startX + 0.4, trackY);
   ctx.lineTo(endX - 0.15, trackY);
   ctx.stroke();
   ctx.setLineDash([]);
   ctx.strokeStyle = ink;
   ctx.lineWidth = 0.14;
   ctx.lineCap = "round";
   ctx.lineJoin = "round";
   ctx.beginPath();
   ctx.moveTo(endX - 0.25, trackY - 0.27);
   ctx.lineTo(endX, trackY);
   ctx.lineTo(endX - 0.25, trackY + 0.27);
   ctx.stroke();
  } else {
   const columnWidth = (WRAP.width - 0.5) / stats.length;
   stats.forEach(({ label, value }, i) => {
    const left = 0.25 + columnWidth * i;
    if (i) {
     ctx.fillStyle = withAlpha(ctx, ink, 0.12);
     ctx.fillRect(left, 6.875, 0.0625, 2.6);
    }
    setFont(boldFont, 0.8);
    ctx.fillStyle = css("--ticket-muted");
    fillSpaced(label.toUpperCase(), left + columnWidth / 2, 7.8, 0.0625);
    setFont(heavyFont, 0.875);
    ctx.fillStyle = ink;
    fillSpaced(value.toUpperCase(), left + columnWidth / 2, 8.9, 0);
   });
  }

  if (dimOpacity > 0) {
   ctx.fillStyle = withAlpha(ctx, ink, 0.06 * dimOpacity);
   ctx.fillRect(0, 0, WRAP.width, WRAP.height);
  }
  if (isLost && stampThud > 0) {
   setFont(heavyFont, 1.15);
   const boxWidth = spacedWidth(noMatchText.toUpperCase(), 0.1875) + 1.5;
   ctx.save();
   ctx.translate(1.625 + boxWidth / 2, 5.5 + 1);
   ctx.rotate((-14 * Math.PI) / 180);
   ctx.scale(lerp(1.8, 1, stampThud), lerp(1.8, 1, stampThud));
   ctx.globalAlpha *= clamp01(0.9 * stampThud);
   ctx.strokeStyle = css("--ticket-danger");
   ctx.lineWidth = 0.1875;
   ctx.strokeRect(-boxWidth / 2, -1, boxWidth, 2);
   ctx.fillStyle = css("--ticket-danger");
   fillSpaced(noMatchText.toUpperCase(), 0, 0.04, 0.1875);
   ctx.restore();
  }
 };

 const drawHalf = (
  shape: keyof typeof SHAPES,
  origin: number[],
  shift: number[],
  turn: number,
 ) => {
  ctx.save();
  ctx.translate(origin[0] + shift[0], origin[1] + shift[1]);
  ctx.rotate((turn * Math.PI) / 180);
  ctx.translate(-origin[0], -origin[1]);
  ctx.globalAlpha = isLost ? torn : 1;
  ctx.beginPath();
  SHAPES[shape].forEach(([x, y], i) => {
   const point = [(x / 100) * WRAP.width, (y / 100) * WRAP.height] as const;
   if (i) ctx.lineTo(...point);
   else ctx.moveTo(...point);
  });
  ctx.closePath();
  ctx.clip();
  ctx.beginPath();
  ctx.rect(-1, -1, WRAP.width + 2, WRAP.height + 2);
  [0, WRAP.width].forEach((x) => {
   ctx.moveTo(x + NOTCH.radius, NOTCH.y);
   ctx.arc(x, NOTCH.y, NOTCH.radius, 0, Math.PI * 2);
  });
  ctx.clip("evenodd");
  const paper = ctx.createLinearGradient(0, 0, 0, WRAP.height);
  paper.addColorStop(0, paperTop);
  paper.addColorStop(1, css("--ticket-paper-bottom"));
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, WRAP.width, WRAP.height);
  drawContent();
  ctx.restore();
 };

 ctx.save();
 ctx.scale(scale, scale);

 if (beamOpacity > 0) {
  const beam = ctx.createLinearGradient(0, 0, 0, SLOT.y);
  beam.addColorStop(0, withAlpha(ctx, gold, 0));
  beam.addColorStop(1, withAlpha(ctx, gold, 0.25 * beamOpacity));
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(8.36875, 0);
  ctx.lineTo(12.56875, 0);
  ctx.lineTo(19.21875, SLOT.y);
  ctx.lineTo(1.71875, SLOT.y);
  ctx.closePath();
  ctx.fill();
 }

 ctx.save();
 ctx.beginPath();
 ctx.rect(0, 0, BOX_WIDTH, RISE_HEIGHT);
 ctx.clip();
 ctx.translate(BOX_WIDTH / 2, RISE_HEIGHT / 2 + popY);
 ctx.scale(popScale, popScale);
 ctx.translate(
  -BOX_WIDTH / 2 + WRAP.x + tugX,
  -RISE_HEIGHT / 2 + WRAP.y + riseY,
 );
 ctx.translate(WRAP.width / 2, WRAP.height / 2);
 ctx.rotate((tugTurn * Math.PI) / 180);
 ctx.translate(-WRAP.width / 2, -WRAP.height / 2);
 if (shadowOpacity > 0) {
  ctx.save();
  ctx.translate(WRAP.width / 2, WRAP.height / 2 + 1);
  ctx.scale(WRAP.width / 2, WRAP.height / 2);
  const shadow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  shadow.addColorStop(0, withAlpha(ctx, ink, 0.35 * shadowOpacity));
  shadow.addColorStop(0.7, withAlpha(ctx, ink, 0.35 * shadowOpacity));
  shadow.addColorStop(1, withAlpha(ctx, ink, 0));
  ctx.fillStyle = shadow;
  ctx.fillRect(-1, -1, 2, 2);
  ctx.restore();
 }
 if (isLost) {
  drawHalf("top", [2.25, 5.5], [-0.375 * tear, -0.375 * tear], -6 * tear);
  drawHalf("bottom", [10.25, 5.5], [0.75 * tear, 1.375 * tear], 7 * tear);
 } else drawHalf("whole", [0, 0], [0, 0], 0);
 ctx.restore();

 ctx.fillStyle = css("--ticket-slot");
 ctx.fillRect(SLOT.x, SLOT.y, SLOT.width, SLOT.height);
 ctx.fillStyle = isLost ? withAlpha(ctx, paperTop, 0.25) : gold;
 ctx.fillRect(SLOT.x, SLOT.y, SLOT.width, 0.125);
 if (slotGlow > 0) {
  ctx.save();
  ctx.translate(SLOT.x + SLOT.width / 2, SLOT.y);
  ctx.scale(SLOT.width / 2 - 0.375, 0.75);
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  glow.addColorStop(0, withAlpha(ctx, gold, 0.6 * slotGlow));
  glow.addColorStop(1, withAlpha(ctx, gold, 0));
  ctx.fillStyle = glow;
  ctx.fillRect(-1, -1, 2, 1);
  ctx.restore();
 }

 if (isFound)
  SPARKS.forEach(({ x, y, size, delay }) => {
   const [grow, spin, opacity] = keyframes(
    progress(sinceFound, delay, 700),
    [
     [0, 0, 0, 0],
     [0.6, 1.3, 45, 1],
     [1, 1, 90, 1],
    ],
    SPARK_EASE,
   );
   if (opacity <= 0) return;
   ctx.save();
   ctx.translate(x + size / 2, y + size / 2);
   ctx.rotate((spin * Math.PI) / 180);
   ctx.scale((grow * size) / 16, (grow * size) / 16);
   ctx.translate(-8, -8);
   ctx.globalAlpha = clamp01(opacity);
   ctx.fillStyle = gold;
   ctx.fill(sparkShape);
   ctx.restore();
  });

 ctx.restore();

 const isSettling = isFound
  ? t < 2100 || sinceFound < 1450
  : isLost
    ? t < 2700
    : true;
 return isSettling || phase === "searching" || !maskImage.naturalWidth;
};

export const snapshotMatchTicket = (): ISplitRevealTicket | null => {
 const canvas = document.querySelector<HTMLCanvasElement>(
  ".match-ticket-canvas",
 );
 const box = canvas?.getBoundingClientRect();
 if (!canvas || !box?.width) return null;
 const unit = box.width / BOX_WIDTH;
 const pixel = canvas.width / box.width;
 const paper = document.createElement("canvas");
 paper.width = Math.round(WRAP.width * unit * pixel);
 paper.height = Math.round(WRAP.height * unit * pixel);
 paper
  .getContext("2d")
  ?.drawImage(
   canvas,
   WRAP.x * unit * pixel,
   WRAP.y * unit * pixel,
   paper.width,
   paper.height,
   0,
   0,
   paper.width,
   paper.height,
  );
 return {
  node: paper,
  rect: new DOMRect(
   box.left + WRAP.x * unit,
   box.top + WRAP.y * unit,
   WRAP.width * unit,
   WRAP.height * unit,
  ),
  tearY: NOTCH.y * unit,
 };
};

export default function MatchTicket({
 status,
 title = matchTicketText,
 chip,
 stats,
 myName,
 opponentName,
}: IMatchTicketProps) {
 const foundAt = useRef<number | null>(null);
 const phase: TPhase =
  status === "timeout"
   ? "lost"
   : status === "revealing" || status === "found"
     ? "found"
     : "searching";
 const rivalName = phase === "lost" ? noRivalText : opponentName || rivalText;
 const label = [
  phase === "found"
   ? matchConfirmedText
   : phase === "lost"
     ? noMatchFoundText
     : title,
  `${myName} ${vsText} ${rivalName}`,
  chip,
  ...stats.map(({ label: name, value }) => `${name} ${value}`),
 ]
  .filter(Boolean)
  .join(", ");
 const draw: ICanvasAnimationProps["draw"] = (ctx, frame) =>
  drawTicket(ctx, frame, {
   phase,
   foundAt,
   title,
   myName,
   rivalName,
   chip,
   stats,
  });

 return (
  <CanvasAnimation
   key={phase === "lost" ? "lost" : "live"}
   customClass="match-ticket-canvas"
   role="img"
   aria-label={label}
   draw={draw}
  />
 );
}
