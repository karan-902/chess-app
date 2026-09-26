import type { ReactNode } from "react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import { ChessLogo } from "@/components/constants";

interface IAuthLayoutProps {
 title: ReactNode;
 subtitle?: ReactNode;
 footer?: ReactNode;
 children: ReactNode;
}

export default function AuthLayout({
 title,
 subtitle,
 footer,
 children,
}: IAuthLayoutProps) {
 return (
  <Box customClass="public-page">
   <Box customClass="public-brand">
    <ChessLogo size={22} showText={true} />
   </Box>
   <Box customClass="public-heading">
    <Text component="h1" customClass="public-title">
     {title}
    </Text>
    <Text component="p" customClass="page-subtitle">
     {subtitle}
    </Text>
   </Box>
   {children}
   {footer && <Text customClass="public-footer caption">{footer}</Text>}
  </Box>
 );
}
