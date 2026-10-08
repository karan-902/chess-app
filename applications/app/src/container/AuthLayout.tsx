import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import type { IAuthLayoutProps } from "@gopvp/app/src/types/component";

export default function AuthLayout({
 title,
 subtitle,
 footer,
 children,
 customClass,
}: IAuthLayoutProps) {
 return (
  <Box customClass={classNames("public-page", customClass)}>
   <Box customClass="public-page-wrapper">
    <Box customClass="public-brand">
     <img src="/gopvp-logo.png" width="auto" height={70} alt="gopvp-logo" />
    </Box>
    <Box customClass="public-heading">
     <Text component="h1" customClass={classNames("public-title", customClass)}>
      {title}
     </Text>
     <Text
      component="p"
      customClass={classNames("page-subtitle", customClass)}
     >
      {subtitle}
     </Text>
    </Box>
   </Box>
   {children}
   {footer && (
    <Text customClass={classNames("public-footer caption", customClass)}>
     {footer}
    </Text>
   )}
  </Box>
 );
}
