import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import { ShatranjLogo } from "@/components/constants";

interface IEmptyStateProps {
    title?: string;
    description?: string;
}

export default function EmptyState({ title, description }: IEmptyStateProps) {
    return (
        <Box customClass="matches-empty">
            <ShatranjLogo size={44} showText={false} muted />
            {title && (
                <Text component="h3" customClass="section-heading">
                    {title}
                </Text>
            )}
            {description && (
                <Text customClass="matches-empty-desc description">
                    {description}
                </Text>
            )}
        </Box>
    );
}
