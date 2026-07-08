import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import { MessageSquare } from "lucide-react";

export default function ChatPanel() {
    return (
        <Box customClass="chat-panel">
            <Box customClass="chat-empty">
                <MessageSquare size={28} strokeWidth={1.3} className="chat-empty-icon" />
                <Text as="p" customClass="chat-empty-text">Chat coming soon</Text>
            </Box>
        </Box>
    );
}
