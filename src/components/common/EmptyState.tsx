import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";

interface IEmptyStateProps {
    title?: string;
    description?: string;
}

export default function EmptyState({ title, description }: IEmptyStateProps) {
    return (
        <Box customClass="matches-empty">
            {title && (
                <Text component="h3" customClass="matches-empty-title section-heading">
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
