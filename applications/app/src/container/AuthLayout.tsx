import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import { icons } from "@gopvp/common/src/components/images";
import {
 HERO_LOGO_PATH,
 // HERO_COIN_PATH,
 // HERO_SPARK_PATH,
 TROPHY_ART_PATH,
} from "@gopvp/app/src/constants/asset";
import {
 // HERO_COIN_COUNT,
 // HERO_SPARK_COUNT,
 HERO_FLOOR,
 HERO_FLOOR_PATH_LEFT,
 HERO_FLOOR_PATH_RIGHT,
 HERO_PATH_WALK,
} from "@gopvp/app/src/constants/limit";
import type { IAuthLayoutProps } from "@gopvp/app/src/types/component";

const floorRowY = Array.from(
 { length: HERO_FLOOR.rows + 1 },
 (_, row) => HERO_FLOOR.height * (row / HERO_FLOOR.rows) ** HERO_FLOOR.depthCurve,
);

const floorX = (col: number, y: number) => {
 const centerX = HERO_FLOOR.width / 2;
 const baseX =
  (HERO_FLOOR.width - HERO_FLOOR.spread) / 2 +
  col * (HERO_FLOOR.spread / HERO_FLOOR.cols);
 return (
  centerX +
  (baseX - centerX) *
   ((y - HERO_FLOOR.vanishY) / (HERO_FLOOR.height - HERO_FLOOR.vanishY))
 );
};

const pathStep = new Map<string, number>();
[HERO_FLOOR_PATH_LEFT, HERO_FLOOR_PATH_RIGHT].forEach((pathKeys) =>
 pathKeys.forEach((key, step) =>
  pathStep.set(key, Math.max(pathStep.get(key) ?? 0, step)),
 ),
);

const rowFade = (row: number) =>
 HERO_FLOOR.dissolveMin +
 (1 - HERO_FLOOR.dissolveMin) *
  (row / (HERO_FLOOR.rows - 1)) ** HERO_FLOOR.dissolveCurve;

const heroFloorTiles = Array.from(
 { length: HERO_FLOOR.rows * HERO_FLOOR.cols },
 (_, index) => {
  const row = Math.floor(index / HERO_FLOOR.cols);
  const col = index % HERO_FLOOR.cols;
  const top = floorRowY[row];
  const bottom = floorRowY[row + 1];
  return {
   path: `M${floorX(col, top)} ${top}L${floorX(col + 1, top)} ${top}L${floorX(col + 1, bottom)} ${bottom}L${floorX(col, bottom)} ${bottom}Z`,
   isAlt: (row + col) % 2 === 1,
   fade: rowFade(row),
   step: pathStep.get(`${row}-${col}`),
  };
 },
);

const heroPathTiles = heroFloorTiles.flatMap(({ path, fade, step }) =>
 step === undefined ? [] : [{ path, fade, step }],
);

const pathWalkOpacity = (step: number, fade: number, head: number) =>
 fade *
 (HERO_PATH_WALK.restOpacity +
  (1 - HERO_PATH_WALK.restOpacity) *
   Math.max(0, 1 - Math.abs(step - head) / HERO_PATH_WALK.pulseWidth));

const walkSteps = HERO_FLOOR_PATH_LEFT.length + HERO_PATH_WALK.leadSteps * 2;

export default function AuthLayout({
 title,
 titleAccent,
 subtitle,
 subtitleAccent,
 footer,
 footerCard,
 children,
}: IAuthLayoutProps) {
 const navigate = useNavigate();
 const pathTileRefs = useRef<(SVGPathElement | null)[]>([]);

 useEffect(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const start = performance.now();
  let frameId = 0;
  const walk = (now: number) => {
   const cycle = ((now - start) / 1000 / HERO_PATH_WALK.periodSeconds) % 1;
   const head = cycle * walkSteps - HERO_PATH_WALK.leadSteps;
   heroPathTiles.forEach(({ step, fade }, index) => {
    const tile = pathTileRefs.current[index];
    if (tile) tile.style.opacity = String(pathWalkOpacity(step, fade, head));
   });
   frameId = requestAnimationFrame(walk);
  };
  frameId = requestAnimationFrame(walk);
  return () => cancelAnimationFrame(frameId);
 }, []);

 return (
  <Box customClass="public-page">
   <Box customClass="public-page-wrapper">
    <Box customClass="public-brand">
     <Box customClass="hero-stage">
      {/* {Array.from({ length: HERO_SPARK_COUNT }, (_, i) => (
       <img
        key={`spark-${i}`}
        className={`hero-spark s${i + 1}`}
        src={HERO_SPARK_PATH}
        alt=""
       />
      ))}
      {Array.from({ length: HERO_COIN_COUNT }, (_, i) => (
       <Box key={`coin-${i}`} customClass={`hero-coin c${i + 1}`}>
        <img src={HERO_COIN_PATH} alt="" />
       </Box>
      ))} */}
      <Box customClass="hero-floor-layer">
       <Box customClass="hero-frame">
        <svg
         className="hero-floor"
         viewBox={`0 0 ${HERO_FLOOR.width} ${HERO_FLOOR.height}`}
         preserveAspectRatio="none"
         aria-hidden
        >
         {heroFloorTiles.map(({ path, isAlt, fade }) => (
          <path
           key={path}
           d={path}
           className={isAlt ? "alt" : undefined}
           opacity={fade}
          />
         ))}
         {heroPathTiles.map(({ path, fade }, index) => (
          <path
           key={`lit-${path}`}
           ref={(tile) => {
            pathTileRefs.current[index] = tile;
           }}
           d={path}
           className="lit"
           style={{ opacity: fade * HERO_PATH_WALK.restOpacity }}
          />
         ))}
        </svg>
       </Box>
      </Box>
      <Box customClass="hero-frame">
       <Box customClass="hero-glow" />
       <img className="hero-logo" src={HERO_LOGO_PATH} alt="gopvp-logo" />
      </Box>
     </Box>
    </Box>
    <Box customClass="public-heading">
     <Text component="h1" customClass="public-title">
      {title}
      {titleAccent && (
       <Text component="span" customClass="public-title-accent">
        {titleAccent}
       </Text>
      )}
     </Text>
     <Text component="p" customClass="page-subtitle public-subtitle">
      {subtitle}
      {subtitleAccent && (
       <>
        {" "}
        <Text component="span" customClass="public-subtitle-accent">
         {subtitleAccent}
        </Text>
       </>
      )}
     </Text>
    </Box>
   </Box>
   {children}
   {footer && <Text customClass="public-footer caption">{footer}</Text>}
   {footerCard && (
    <Box customClass="auth-footer-bar">
     <Box customClass="auth-footer-trophy">
      <img src={TROPHY_ART_PATH} alt="" />
     </Box>
     <Box customClass="auth-footer-copy">
      <Text customClass="auth-footer-title">{footerCard.title}</Text>
      <Text customClass="auth-footer-tagline">
       <icons.sparkle />
       {footerCard.tagline}
      </Text>
     </Box>
     <Button
      type="button"
      variant="contained"
      customClass="auth-footer-btn"
      onClick={() => navigate(footerCard.to)}
     >
      {footerCard.actionText}
     </Button>
    </Box>
   )}
  </Box>
 );
}
