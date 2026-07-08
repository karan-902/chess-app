import { useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence } from "motion/react";
import LobbyPage from "./LobbyPage";
import GameSetupModal from "./GameSetupModal";
import type { Difficulty, GameMode, TimeControl } from "@/types/components";

export default function Lobby() {
    const [mode, setMode]               = useState<GameMode | null>(null);
    const [difficulty, setDifficulty]   = useState<Difficulty | null>(null);
    const [timeControl, setTimeControl] = useState<TimeControl | null>(null);
    const [modalOpen, setModalOpen]     = useState(false);
    const navigate = useNavigate();

    const handleModeSelect = (m: GameMode) => {
        setMode(m);
        setDifficulty(null);
        setTimeControl(null);
        setModalOpen(true);
    };

    const handleClose = () => {
        setModalOpen(false);
        setMode(null);
        setDifficulty(null);
        setTimeControl(null);
    };

    const handleStart = () => {
        navigate(
            `/play?mode=${mode}&difficulty=${difficulty ?? "medium"}&time=${timeControl}`,
        );
    };

    return (
        <>
            <LobbyPage onModeSelect={handleModeSelect} />
            <AnimatePresence>
                {modalOpen && mode && (
                    <GameSetupModal
                        key="game-setup"
                        mode={mode}
                        difficulty={difficulty}
                        timeControl={timeControl}
                        onDifficultyChange={setDifficulty}
                        onTimeControlChange={setTimeControl}
                        onStart={handleStart}
                        onClose={handleClose}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
