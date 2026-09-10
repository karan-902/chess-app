import { useState } from "react";
import Box from "@/components/base/Box/Box";
import Button from "@/components/base/Button/Button";
import Drawer from "@/components/base/Drawer/Drawer";
import ChipSelect from "@/components/common/ChipSelect";
import { TIME_SECONDS } from "@/constants";
import { CATEGORY_META } from "@/constants/config";
import type { Difficulty } from "@/types/components";
import type { GameCategory } from "@/types/types";
import type { IPracticeSheetProps } from "@/types/components";
import {
    playSheetCardPlayButton,
    matchmakingConfirmCancelButton,
    playWagerBadgeDifficultyLabels,
    historyTimeControlLabel,
} from "@/constants/messages";

const PRACTICE_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const CATEGORY_ORDER: GameCategory[] = [
    "BULLET",
    "BLITZ",
    "RAPID",
    "CLASSICAL",
];

export default function PracticeSheet({
    open,
    onClose,
    onCancel,
    onPlay,
}: IPracticeSheetProps) {
    const [difficulty, setDifficulty] = useState<Difficulty>("easy");
    const [timeControl, setTimeControl] = useState<GameCategory>("RAPID");

    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            customClass="practice-sheet"
        >
            <Box customClass="matchmaking-searching practice-options">
                <ChipSelect
                    options={PRACTICE_DIFFICULTIES}
                    value={difficulty}
                    onChange={setDifficulty}
                    label={(d) => playWagerBadgeDifficultyLabels[d]}
                    customClass="segment compact"
                />
                <ChipSelect
                    options={CATEGORY_ORDER}
                    value={timeControl}
                    onChange={setTimeControl}
                    label={(c) => CATEGORY_META[c]?.label}
                    subLabel={(c) =>
                        historyTimeControlLabel(TIME_SECONDS[c] / 60)
                    }
                    customClass="segment category-select"
                />
                <Box customClass="pool-confirm-actions">
                    <Button
                        type="button"
                        variant="contained"
                        fullWidth
                        customClass="stake-card-go"
                        onClick={() => onPlay(difficulty, timeControl)}
                    >
                        {playSheetCardPlayButton}
                    </Button>
                    <Button
                        type="button"
                        variant="outlined"
                        fullWidth
                        customClass="pool-confirm-cancel-btn"
                        onClick={onCancel}
                    >
                        {matchmakingConfirmCancelButton}
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
}
