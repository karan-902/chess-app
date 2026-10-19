import { forwardRef, useId } from "react";
import type { ReactNode } from "react";
import SvgIcon from "@gopvp/common/src/components/SvgIcon/SvgIcon";
import type { ISvgIconProps } from "@gopvp/common/src/components/SvgIcon/SvgIcon";

interface IPieceIconProps extends ISvgIconProps {
 code: string;
}

const PIECE_DARK_COLOR = "#000";
const PIECE_LIGHT_COLOR = "#fff";
const PIECE_DARK_DETAIL_COLOR = "#ececec";

const useSvgId = () => useId().replace(/:/g, "");

export const GoogleIcon = forwardRef<SVGSVGElement, ISvgIconProps>(
 function GoogleIcon(props, ref) {
  return (
   <SvgIcon ref={ref} viewBox="0 0 24 24" fontSize="inherit" {...props}>
    <path
     d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
     fill="#4285F4"
    />
    <path
     d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
     fill="#34A853"
    />
    <path
     d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
     fill="#FBBC05"
    />
    <path
     d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
     fill="#EA4335"
    />
   </SvgIcon>
  );
 },
);

export const SparkIcon = forwardRef<SVGSVGElement, ISvgIconProps>(
 function SparkIcon(props, ref) {
  return (
   <SvgIcon ref={ref} viewBox="0 0 20 20" {...props}>
    <path
     d="M10 0C11 7 13 9 20 10 13 11 11 13 10 20 9 13 7 11 0 10 7 9 9 7 10 0Z"
     fill="#fff6d6"
    />
   </SvgIcon>
  );
 },
);

export const CoinStarIcon = forwardRef<SVGSVGElement, ISvgIconProps>(
 function CoinStarIcon(props, ref) {
  return (
   <SvgIcon ref={ref} viewBox="0 0 64 64" {...props}>
    <circle cx="32" cy="32" r="30" fill="#e5a900" />
    <circle cx="32" cy="32" r="25" fill="#ffc400" />
    <path
     d="M32 17l4.4 9.6 10.4 1.1-7.8 7 2.3 10.3L32 39.7 22.7 45l2.3-10.3-7.8-7 10.4-1.1z"
     fill="#e5a900"
    />
    <ellipse
     cx="22"
     cy="20"
     rx="7"
     ry="3.5"
     fill="#fff3cc"
     opacity={0.55}
     transform="rotate(-35 22 20)"
    />
   </SvgIcon>
  );
 },
);

export const TrophyArtIcon = forwardRef<SVGSVGElement, ISvgIconProps>(
 function TrophyArtIcon(props, ref) {
  const id = useSvgId();
  const cupStops = (
   <>
    <stop stopColor="#FFF1A8" />
    <stop offset="0.45" stopColor="#FFC400" />
    <stop offset="1" stopColor="#C98F00" />
   </>
  );
  const handleStops = (
   <>
    <stop stopColor="#E5A900" />
    <stop offset="1" stopColor="#8A6A00" />
   </>
  );
  return (
   <SvgIcon ref={ref} viewBox="0 0 24 24" {...props}>
    <g fill="none">
     <path
      d="M6.75 3.75H17.25V9C17.25 12 15 14.25 12 14.25C9 14.25 6.75 12 6.75 9V3.75Z"
      fill={`url(#${id}a)`}
     />
     <path
      d="M6.75 5.25H4.125C4.125 8.25 5.625 10.125 7.5 10.5"
      stroke={`url(#${id}b)`}
      strokeWidth="4"
      strokeLinecap="round"
     />
     <path
      d="M17.25 5.25H19.875C19.875 8.25 18.375 10.125 16.5 10.5"
      stroke={`url(#${id}c)`}
      strokeWidth="4"
      strokeLinecap="round"
     />
     <path d="M13.5 13.875H10.5V17.25H13.5V13.875Z" fill={`url(#${id}d)`} />
     <path
      d="M7.875 17.25H16.125L16.875 20.25H7.125L7.875 17.25Z"
      fill={`url(#${id}e)`}
     />
     <path
      d="M16.875 19.875H7.125C6.71079 19.875 6.375 20.2108 6.375 20.625V21C6.375 21.4142 6.71079 21.75 7.125 21.75H16.875C17.2892 21.75 17.625 21.4142 17.625 21V20.625C17.625 20.2108 17.2892 19.875 16.875 19.875Z"
      fill={`url(#${id}f)`}
     />
     <path
      d="M12 6L12.9 7.8375L14.925 8.1375L13.4625 9.5625L13.8 11.5875L12 10.6125L10.2 11.5875L10.5375 9.5625L9.075 8.1375L11.1 7.8375L12 6Z"
      fill="#FFF6CC"
     />
     <path
      d="M8.25 4.875C8.25 4.875 8.625 9.375 10.5 11.25"
      stroke="white"
      strokeOpacity={0.55}
      strokeWidth="2.4"
      strokeLinecap="round"
     />
    </g>
    <defs>
     <linearGradient
      id={`${id}a`}
      x1="6.75"
      y1="3.75"
      x2="6.75"
      y2="14.25"
      gradientUnits="userSpaceOnUse"
     >
      {cupStops}
     </linearGradient>
     <linearGradient
      id={`${id}b`}
      x1="4.125"
      y1="5.25"
      x2="4.125"
      y2="10.5"
      gradientUnits="userSpaceOnUse"
     >
      {handleStops}
     </linearGradient>
     <linearGradient
      id={`${id}c`}
      x1="16.5"
      y1="5.25"
      x2="16.5"
      y2="10.5"
      gradientUnits="userSpaceOnUse"
     >
      {handleStops}
     </linearGradient>
     <linearGradient
      id={`${id}d`}
      x1="10.5"
      y1="13.875"
      x2="10.5"
      y2="17.25"
      gradientUnits="userSpaceOnUse"
     >
      {handleStops}
     </linearGradient>
     <linearGradient
      id={`${id}e`}
      x1="7.125"
      y1="17.25"
      x2="7.125"
      y2="20.25"
      gradientUnits="userSpaceOnUse"
     >
      {cupStops}
     </linearGradient>
     <linearGradient
      id={`${id}f`}
      x1="6.375"
      y1="19.875"
      x2="6.375"
      y2="21.75"
      gradientUnits="userSpaceOnUse"
     >
      {handleStops}
     </linearGradient>
    </defs>
   </SvgIcon>
  );
 },
);

export const Wallet3dIcon = forwardRef<SVGSVGElement, ISvgIconProps>(
 function Wallet3dIcon(props, ref) {
  const id = useSvgId();
  return (
   <SvgIcon ref={ref} viewBox="0 0 52 52" {...props}>
    <g transform="rotate(8 26 28)">
     <rect
      x="11"
      y="9"
      width="20"
      height="13"
      rx="2.5"
      fill="#4a4fd8"
      transform="rotate(-6 21 15)"
     />
     <rect
      x="16"
      y="6"
      width="22"
      height="16"
      rx="2.5"
      fill={`url(#${id}note)`}
     />
     <rect x="8" y="18" width="38" height="26" rx="7" fill="#8a6a1a" />
     <rect
      x="6"
      y="16"
      width="38"
      height="26"
      rx="7"
      fill={`url(#${id}body)`}
     />
     <rect
      x="9"
      y="18"
      width="31"
      height="2"
      rx="1"
      fill="#ffffff"
      fillOpacity="0.35"
     />
     <rect x="31" y="26" width="15" height="12" rx="4" fill="#9a7a1c" />
     <rect
      x="30"
      y="25"
      width="15"
      height="11"
      rx="4"
      fill={`url(#${id}flap)`}
     />
     <circle cx="38" cy="30.5" r="2.4" fill="#6b4f12" />
    </g>
    <defs>
     <linearGradient id={`${id}note`} x1="0" y1="0" x2="0" y2="1">
      <stop stopColor="#BFE8A8" />
      <stop offset="1" stopColor="#8FD06A" />
     </linearGradient>
     <linearGradient id={`${id}body`} x1="0" y1="0" x2="0" y2="1">
      <stop stopColor="#FFE07A" />
      <stop offset="1" stopColor="#E8B33A" />
     </linearGradient>
     <linearGradient id={`${id}flap`} x1="0" y1="0" x2="0" y2="1">
      <stop stopColor="#F7D46A" />
      <stop offset="1" stopColor="#E5AE2E" />
     </linearGradient>
    </defs>
   </SvgIcon>
  );
 },
);

export const PieceIcon = forwardRef<SVGSVGElement, IPieceIconProps>(
 function PieceIcon({ code, ...props }, ref) {
  return (
   <SvgIcon
    ref={ref}
    viewBox="0 0 45 45"
    htmlColor={PIECE_DARK_COLOR}
    {...props}
   >
    {PIECE_PATHS[code]}
   </SvgIcon>
  );
 },
);

const PIECE_PATHS: Record<string, ReactNode> = {
 wK: (
  <g
   fill="none"
   fillRule="evenodd"
   stroke={PIECE_DARK_COLOR}
   strokeLinecap="round"
   strokeLinejoin="round"
   strokeWidth={1.5}
  >
   <path strokeLinejoin="miter" d="M22.5 11.63V6M20 8h5" />
   <path
    fill={PIECE_LIGHT_COLOR}
    strokeLinecap="butt"
    strokeLinejoin="miter"
    d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
   />
   <path
    fill={PIECE_LIGHT_COLOR}
    d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10z"
   />
   <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
  </g>
 ),
 wQ: (
  <g
   fill={PIECE_LIGHT_COLOR}
   fillRule="evenodd"
   stroke={PIECE_DARK_COLOR}
   strokeLinecap="round"
   strokeLinejoin="round"
   strokeWidth={1.5}
  >
   <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0m16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0M41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0M16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0M33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0" />
   <path
    strokeLinecap="butt"
    d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14z"
   />
   <path
    strokeLinecap="butt"
    d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"
   />
   <path fill="none" d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" />
  </g>
 ),
 wR: (
  <g
   fill={PIECE_LIGHT_COLOR}
   fillRule="evenodd"
   stroke={PIECE_DARK_COLOR}
   strokeLinecap="round"
   strokeLinejoin="round"
   strokeWidth={1.5}
  >
   <path
    strokeLinecap="butt"
    d="M9 39h27v-3H9zm3-3v-4h21v4zm-1-22V9h4v2h5V9h5v2h5V9h4v5"
   />
   <path d="m34 14-3 3H14l-3-3" />
   <path strokeLinecap="butt" strokeLinejoin="miter" d="M31 17v12.5H14V17" />
   <path d="m31 29.5 1.5 2.5h-20l1.5-2.5" />
   <path fill="none" strokeLinejoin="miter" d="M11 14h23" />
  </g>
 ),
 wB: (
  <g
   fill="none"
   fillRule="evenodd"
   stroke={PIECE_DARK_COLOR}
   strokeLinecap="round"
   strokeLinejoin="round"
   strokeWidth={1.5}
  >
   <g fill={PIECE_LIGHT_COLOR} strokeLinecap="butt">
    <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.94 3-2 3-2z" />
    <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
    <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
   </g>
   <path strokeLinejoin="miter" d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" />
  </g>
 ),
 wN: (
  <g
   fill="none"
   fillRule="evenodd"
   stroke={PIECE_DARK_COLOR}
   strokeLinecap="round"
   strokeLinejoin="round"
   strokeWidth={1.5}
  >
   <path
    fill={PIECE_LIGHT_COLOR}
    d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"
   />
   <path
    fill={PIECE_LIGHT_COLOR}
    d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"
   />
   <path
    fill={PIECE_DARK_COLOR}
    d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0m5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5"
   />
  </g>
 ),
 wP: (
  <path
   fill={PIECE_LIGHT_COLOR}
   stroke={PIECE_DARK_COLOR}
   strokeLinecap="round"
   strokeWidth={1.5}
   d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
  />
 ),
 bK: (
  <g
   fill="none"
   fillRule="evenodd"
   stroke={PIECE_DARK_COLOR}
   strokeLinecap="round"
   strokeLinejoin="round"
   strokeWidth={1.5}
  >
   <path strokeLinejoin="miter" d="M22.5 11.6V6" />
   <path
    fill={PIECE_DARK_COLOR}
    strokeLinecap="butt"
    strokeLinejoin="miter"
    d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
   />
   <path
    fill={PIECE_DARK_COLOR}
    d="M11.5 37a22.3 22.3 0 0 0 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10z"
   />
   <path strokeLinejoin="miter" d="M20 8h5" />
   <path
    stroke={PIECE_DARK_DETAIL_COLOR}
    d="M32 29.5s8.5-4 6-9.7C34.1 14 25 18 22.5 24.6v2.1-2.1C20 18 9.9 14 7 19.9c-2.5 5.6 4.8 9 4.8 9"
   />
   <path
    stroke={PIECE_DARK_DETAIL_COLOR}
    d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"
   />
  </g>
 ),
 bQ: (
  <g
   fillRule="evenodd"
   stroke={PIECE_DARK_COLOR}
   strokeLinecap="round"
   strokeLinejoin="round"
   strokeWidth={1.5}
  >
   <g stroke="none">
    <circle cx={6} cy={12} r={2.75} />
    <circle cx={14} cy={9} r={2.75} />
    <circle cx={22.5} cy={8} r={2.75} />
    <circle cx={31} cy={9} r={2.75} />
    <circle cx={39} cy={12} r={2.75} />
   </g>
   <path
    strokeLinecap="butt"
    d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5z"
   />
   <path
    strokeLinecap="butt"
    d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"
   />
   <path fill="none" strokeLinecap="butt" d="M11 38.5a35 35 1 0 0 23 0" />
   <path
    fill="none"
    stroke={PIECE_DARK_DETAIL_COLOR}
    d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0m-23 3a35 35 1 0 0 24 0"
   />
  </g>
 ),
 bR: (
  <g
   fillRule="evenodd"
   stroke={PIECE_DARK_COLOR}
   strokeLinecap="round"
   strokeLinejoin="round"
   strokeWidth={1.5}
  >
   <path
    strokeLinecap="butt"
    d="M9 39h27v-3H9zm3.5-7 1.5-2.5h17l1.5 2.5zm-.5 4v-4h21v4z"
   />
   <path strokeLinecap="butt" strokeLinejoin="miter" d="M14 29.5v-13h17v13z" />
   <path
    strokeLinecap="butt"
    d="M14 16.5 11 14h23l-3 2.5zM11 14V9h4v2h5V9h5v2h5V9h4v5z"
   />
   <path
    fill="none"
    stroke={PIECE_DARK_DETAIL_COLOR}
    strokeLinejoin="miter"
    strokeWidth={1}
    d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23"
   />
  </g>
 ),
 bB: (
  <g
   fill="none"
   fillRule="evenodd"
   stroke={PIECE_DARK_COLOR}
   strokeLinecap="round"
   strokeLinejoin="round"
   strokeWidth={1.5}
  >
   <g fill={PIECE_DARK_COLOR} strokeLinecap="butt">
    <path d="M9 36c3.4-1 10.1.4 13.5-2 3.4 2.4 10.1 1 13.5 2 0 0 1.6.5 3 2-.7 1-1.6 1-3 .5-3.4-1-10.1.5-13.5-1-3.4 1.5-10.1 0-13.5 1-1.4.5-2.3.5-3-.5 1.4-2 3-2 3-2z" />
    <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
    <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
   </g>
   <path
    stroke={PIECE_DARK_DETAIL_COLOR}
    strokeLinejoin="miter"
    d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"
   />
  </g>
 ),
 bN: (
  <g
   fill="none"
   fillRule="evenodd"
   stroke={PIECE_DARK_COLOR}
   strokeLinecap="round"
   strokeLinejoin="round"
   strokeWidth={1.5}
  >
   <path
    fill={PIECE_DARK_COLOR}
    d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"
   />
   <path
    fill={PIECE_DARK_COLOR}
    d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.04-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-1-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-2 2.5-3c1 0 1 3 1 3"
   />
   <path
    fill={PIECE_DARK_DETAIL_COLOR}
    stroke={PIECE_DARK_DETAIL_COLOR}
    d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0m5.43-9.75a.5 1.5 30 1 1-.86-.5.5 1.5 30 1 1 .86.5"
   />
   <path
    fill={PIECE_DARK_DETAIL_COLOR}
    stroke="none"
    d="m24.55 10.4-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34s-5.79-6.64-9.19-7.16z"
   />
  </g>
 ),
 bP: (
  <path
   stroke={PIECE_DARK_COLOR}
   strokeLinecap="round"
   strokeWidth={1.5}
   d="M22.5 9a4 4 0 0 0-3.22 6.38 6.48 6.48 0 0 0-.87 10.65c-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47a6.46 6.46 0 0 0-.87-10.65A4.01 4.01 0 0 0 22.5 9z"
  />
 ),
};
