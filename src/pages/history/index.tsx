import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import { ClipboardList } from "lucide-react";

export default function GameHistory() {
    return (
        <Box customClass="history-view">
            <Box customClass="lobby-heading">
                <Text as="h1" customClass="lobby-heading-title">Game History</Text>
                <Text as="p" customClass="lobby-heading-sub">
                    Your recent games will appear here
                </Text>
            </Box>

            <Box customClass="history-empty">
                <ClipboardList size={40} strokeWidth={1.2} className="history-empty-icon" />
                <Text as="p" customClass="history-empty-text">No games played yet</Text>
            </Box>
        </Box>
    );
}
