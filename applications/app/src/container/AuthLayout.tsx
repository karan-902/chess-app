import { useNavigate } from "react-router-dom";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import { icons } from "@gopvp/common/src/components/images";
import { TrophyArtIcon } from "@gopvp/common/src/components/constants";
import { HERO_LOGO_PATH } from "@gopvp/app/src/constants/asset";
import {
 HERO_FLOOR,
 HERO_FLOOR_PATH_LEFT,
 HERO_FLOOR_PATH_RIGHT,
 HERO_PATH_WALK,
} from "@gopvp/app/src/constants/limit";
import type { IAuthLayoutProps } from "@gopvp/app/src/types/component";

const floorRowY = Array.from(
 { length: HERO_FLOOR.rows + 1 },
 (_, row) =>
  HERO_FLOOR.height * (row / HERO_FLOOR.rows) ** HERO_FLOOR.depthCurve,
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

const walkSteps = HERO_FLOOR_PATH_LEFT.length + HERO_PATH_WALK.leadSteps * 2;

const heroPathTiles = heroFloorTiles.flatMap(({ path, fade, step }) =>
 step === undefined
  ? []
  : [
     {
      path,
      fade,
      delay: `${((step + HERO_PATH_WALK.leadSteps) / walkSteps - 1.5) * HERO_PATH_WALK.periodSeconds}s`,
     },
    ],
);

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

 return (
  <Box customClass="public-page">
   <Box customClass="public-page-wrapper">
    <Box customClass="public-brand">
     <Box customClass="hero-stage">
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
        </svg>
        {heroPathTiles.map(({ path, fade, delay }) => (
         <svg
          key={path}
          className="hero-floor hero-lit-tile"
          viewBox={`0 0 ${HERO_FLOOR.width} ${HERO_FLOOR.height}`}
          preserveAspectRatio="none"
          style={{
           animationDuration: `${HERO_PATH_WALK.periodSeconds}s`,
           animationDelay: delay,
          }}
          aria-hidden
         >
          <path d={path} className="lit" opacity={fade} />
         </svg>
        ))}
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
      <TrophyArtIcon />
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
      variant="outlined"
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
