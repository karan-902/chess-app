import type { ReactNode } from "react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import { ShatranjLogo } from "@/components/constants";

interface IAuthLayoutProps {
    title: ReactNode;
    subtitle: ReactNode;
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
        <Box customClass="auth-page">
            <Box customClass="auth-brand">
                <ShatranjLogo size={22} showText={true} />
            </Box>
            <Box customClass="auth-heading">
                <Text component="h1" customClass="auth-title">
                    {title}
                </Text>
                <Text component="p" customClass="page-subtitle">
                    {subtitle}
                </Text>
            </Box>
            {children}
            {footer && <Text customClass="auth-footer caption">{footer}</Text>}
        </Box>
    );
}
