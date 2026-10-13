import { useNavigate } from "react-router-dom";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import { icons } from "@gopvp/common/src/components/images";
import {
 HERO_LOGO_PATH,
 HERO_COIN_PATH,
 HERO_SPARK_PATH,
 TROPHY_ART_PATH,
} from "@gopvp/app/src/constants/asset";
import {
 HERO_COIN_COUNT,
 HERO_SPARK_COUNT,
} from "@gopvp/app/src/constants/limit";
import type { IAuthLayoutProps } from "@gopvp/app/src/types/component";

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
      <Box customClass="hero-glow" />
      {Array.from({ length: HERO_SPARK_COUNT }, (_, i) => (
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
      ))}
      <img className="hero-logo" src={HERO_LOGO_PATH} alt="gopvp-logo" />
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
