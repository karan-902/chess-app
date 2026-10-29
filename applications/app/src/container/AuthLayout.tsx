import { NavLink } from "react-router-dom";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import { HERO_LOGO_PATH } from "@gopvp/app/src/constants/asset";
import type { IAuthLayoutProps } from "@gopvp/app/src/types/component";

export default function AuthLayout({
 title,
 subtitle,
 footer,
 footerCard,
 children,
}: IAuthLayoutProps) {
 return (
  <Box customClass="public-page">
   <Box customClass="auth-heading">
    <img className="auth-logo" src={HERO_LOGO_PATH} alt="gopvp-logo" />
    <Text component="h1" customClass="auth-title">
     {title}
    </Text>
    <Text component="p" customClass="auth-subtitle">
     {subtitle}
    </Text>
   </Box>
   {children}
   {footer && <Text customClass="public-footer caption">{footer}</Text>}
   {footerCard && (
    <Text customClass="auth-footer-row">
     {footerCard.title}
     <NavLink to={footerCard.to} className="auth-link">
      {footerCard.actionText}
     </NavLink>
    </Text>
   )}
  </Box>
 );
}
