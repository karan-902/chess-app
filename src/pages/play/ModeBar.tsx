import clsx from "clsx";
import { Users, Monitor } from "lucide-react";
import Box from "../../components/base/Box/Box";
import Button from "../../components/base/Button/Button";
import type { GameMode, Difficulty } from "../../App";

interface IModeBarProps {
    mode: GameMode;
    difficulty: Difficulty;
    onModeChange: (m: GameMode) => void;
    onDifficultyChange: (d: Difficulty) => void;
}

const DIFFICULTIES: { key: Difficulty; label: string }[] = [
    { key: "easy", label: "Easy" },
    { key: "medium", label: "Medium" },
    { key: "hard", label: "Hard" },
];

function ModeBar({ mode, difficulty, onModeChange, onDifficultyChange }: IModeBarProps) {
    return (
        <Box customClass="mode-bar">
            <Box customClass="mode-toggle">
                <Button
                    customClass={clsx("mode-pill", mode === "pvp" && "active")}
                    onClick={() => onModeChange("pvp")}
                >
                    <Users size={13} />
                    PvP
                </Button>
                <Button
                    customClass={clsx("mode-pill", mode === "pvc" && "active")}
                    onClick={() => onModeChange("pvc")}
                >
                    <Monitor size={13} />
                    vs Computer
                </Button>
            </Box>

            {mode === "pvc" && (
                <Box customClass="difficulty-toggle">
                    {DIFFICULTIES.map(({ key, label }) => (
                        <Button
                            key={key}
                            customClass={clsx("diff-pill", difficulty === key && `active-${key}`)}
                            onClick={() => onDifficultyChange(key)}
                        >
                            {label}
                        </Button>
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default ModeBar;
