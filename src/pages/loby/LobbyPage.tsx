import { User, Monitor } from "lucide-react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import type { GameMode } from "@/types/components";

interface ILobbyViewProps {
    onModeSelect: (m: GameMode) => void;
}

export default function LobbyPage({ onModeSelect }: ILobbyViewProps) {
    return (
        <Box customClass="lobby-page">

            {/* ── Page heading ──────────────────────────────── */}
            <Box customClass="lobby-heading">
                <Text as="h1" customClass="lobby-heading-title">New Game</Text>
                <Text as="p" customClass="lobby-heading-sub">
                    Choose how you want to play
                </Text>
            </Box>

            {/* ── Game Mode ─────────────────────────────────── */}
            <Box customClass="lobby-block">
                <Text as="span" customClass="section-title">Game Mode</Text>
                <Box customClass="lobby-mode-grid">

                    {/* PvP */}
                    <button
                        className="lobby-mode-card"
                        onClick={() => onModeSelect("pvp")}
                    >
                        <Box customClass="lmc-icon-wrap">
                            <User size={24} strokeWidth={1.5} className="lmc-icon" />
                        </Box>
                        <Text as="span" customClass="lmc-title">Player vs Player</Text>
                        <Text as="span" customClass="lmc-desc">Compete for real stakes</Text>
                    </button>

                    {/* vs Computer */}
                    <button
                        className="lobby-mode-card"
                        onClick={() => onModeSelect("pvc")}
                    >
                        <Box customClass="lmc-icon-wrap">
                            <Monitor size={24} strokeWidth={1.5} className="lmc-icon" />
                        </Box>
                        <Text as="span" customClass="lmc-title">vs Computer</Text>
                        <Text as="span" customClass="lmc-desc">Solo · sharpen your skills</Text>
                    </button>

                </Box>
            </Box>

        </Box>
    );
}
