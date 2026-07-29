import { GameMode } from "@/types/components";
import Box from "../../components/base/Box/Box";
import Button from "../../components/base/Button/Button";
import {
    playActionButtonsDraw,
    playActionButtonsResign,
} from "@/components/messages";

interface IActionButtonsProps {
    mode: GameMode;

    onResign?: () => void;
    onDraw?: () => void;
    disabled?: boolean;
    drawDisabled?: boolean;
}

function ActionButtons({
    mode,
    onResign,
    onDraw,
    disabled,
    drawDisabled,
}: IActionButtonsProps) {
    return (
        <Box customClass="play-actions">
            <Button
                variant="outline"
                size="md"
                style={{ ...(mode === "pvc" && { display: "none" }) }}
                fullWidth
                onClick={onDraw}
                disabled={disabled || drawDisabled}
            >
                {playActionButtonsDraw}
            </Button>
            <Button
                variant="danger"
                size="md"
                fullWidth
                onClick={onResign}
                disabled={disabled}
            >
                {playActionButtonsResign}
            </Button>
        </Box>
    );
}

export default ActionButtons;
