import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import type { IAuthLayoutProps } from "@gopvp/app/src/types/component";

export default function AuthLayout({
 title,
 subtitle,
 footer,
 children,
}: IAuthLayoutProps) {
 return (
  <Box customClass="public-page">
   <Box customClass="public-page-wrapper">
    <Box customClass="public-brand">
     <img src="/gopvp-logo.png" width="auto" height={70} alt="gopvp-logo" />
    </Box>
    <Box customClass="public-heading">
     <Text component="h1" customClass="public-title">
      {title}
     </Text>
     <Text component="p" customClass="page-subtitle">
      {subtitle}
     </Text>
    </Box>
   </Box>
   {children}
   {footer && <Text customClass="public-footer caption">{footer}</Text>}
  </Box>
 );
}
