import { motion } from "motion/react";
import {
    X,
    ArrowRight,
    Timer,
    Zap,
    Clock,
    BookOpen,
    Shield,
    Flame,
    Monitor,
    User,
} from "lucide-react";
import clsx from "clsx";
import type { Difficulty, GameMode, TimeControl } from "@/types/components";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";

const DIFF_OPTIONS: {
    key: Difficulty;
    label: string;
    rating: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    featured?: boolean;
}[] = [
    {
        key: "easy",
        label: "Easy",
        rating: "~100",
        desc: "Beginner friendly",
        icon: <Zap size={16} strokeWidth={1.8} />,
        color: "green",
        featured: true,
    },
    {
        key: "medium",
        label: "Medium",
        rating: "~1600",
        desc: "~1600",
        icon: <Shield size={16} strokeWidth={1.8} />,
        color: "gold",
    },
    {
        key: "hard",
        label: "Hard",
        rating: "~3000",
        desc: "~3000",
        icon: <Flame size={16} strokeWidth={1.8} />,
        color: "red",
    },
];

const TIME_OPTIONS: {
    key: TimeControl;
    label: string;
    duration: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    featured?: boolean;
}[] = [
    { key: "bullet",    label: "Bullet",    duration: "1 min",  desc: "Ultra-fast & intense", icon: <Timer    size={16} strokeWidth={1.8} />, color: "red",   featured: true },
    { key: "blitz",     label: "Blitz",     duration: "5 min",  desc: "5 min",                icon: <Zap      size={16} strokeWidth={1.8} />, color: "gold"  },
    { key: "rapid",     label: "Rapid",     duration: "10 min", desc: "10 min",               icon: <Clock    size={16} strokeWidth={1.8} />, color: "cyan"  },
    { key: "classical", label: "Classical", duration: "30 min", desc: "30 min",               icon: <BookOpen size={16} strokeWidth={1.8} />, color: "green" },
];

interface IGameSetupModalProps {
    mode: GameMode;
    difficulty: Difficulty | null;
    timeControl: TimeControl | null;
    onDifficultyChange: (d: Difficulty) => void;
    onTimeControlChange: (t: TimeControl) => void;
    onStart: () => void;
    onClose: () => void;
}

export default function GameSetupModal({
    mode,
    difficulty,
    timeControl,
    onDifficultyChange,
    onTimeControlChange,
    onStart,
    onClose,
}: IGameSetupModalProps) {
    const canStart =
        !!timeControl && (mode === "pvp" || (mode === "pvc" && !!difficulty));

    const ModeIcon = mode === "pvc" ? Monitor : User;

    return (
        <motion.div
            className="gsm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
        >
            <motion.div
                className="gsm-panel"
                initial={{ opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 24 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <Box customClass="gsm-header">
                    <Box customClass="gsm-header-left">
                        <Box customClass="gsm-header-icons">
                            <User size={22} strokeWidth={1.6} className="gsm-header-icon" />
                            <Text as="span" customClass="gsm-header-vs">vs</Text>
                            <ModeIcon size={22} strokeWidth={1.6} className="gsm-header-icon" />
                        </Box>
                    </Box>
                    <Button customClass="gsm-close" onClick={onClose}>
                        <X size={16} />
                    </Button>
                </Box>

                {/* Body */}
                <Box customClass="gsm-body">

                    {/* Difficulty — pvc only */}
                    {mode === "pvc" && (
                        <Box customClass="gsm-section">
                            <Text as="span" customClass="section-title">Difficulty</Text>
                            <Box customClass="gsm-diff-row">
                                {DIFF_OPTIONS.map(({ key, label, rating, desc, icon, color, featured }) => (
                                    <button
                                        key={key}
                                        className={clsx(
                                            "gsm-diff-btn",
                                            `gsm-diff-btn--${color}`,
                                            featured && "gsm-diff-btn--featured",
                                            difficulty === key && "active",
                                        )}
                                        onClick={() => onDifficultyChange(key)}
                                    >
                                        <span className="gsm-diff-icon">{icon}</span>
                                        <div className="gsm-diff-text">
                                            <span className="gsm-diff-label">{label}</span>
                                            <span className="gsm-diff-rating">{featured ? desc : rating}</span>
                                        </div>
                                    </button>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Time Control */}
                    <Box customClass="gsm-section">
                        <Text as="span" customClass="section-title">Time Control</Text>
                        <Box customClass="gsm-time-row">
                            {TIME_OPTIONS.map(({ key, label, duration, desc, icon, color, featured }) => (
                                <button
                                    key={key}
                                    className={clsx(
                                        "gsm-time-btn",
                                        `gsm-time-btn--${color}`,
                                        featured && "gsm-time-btn--featured",
                                        timeControl === key && "active",
                                    )}
                                    onClick={() => onTimeControlChange(key)}
                                >
                                    <span className="gsm-time-icon">{icon}</span>
                                    <div className="gsm-time-text">
                                        <span className="gsm-time-label">{label}</span>
                                        <span className="gsm-time-dur">{featured ? desc : duration}</span>
                                    </div>
                                </button>
                            ))}
                        </Box>
                    </Box>

                </Box>

                {/* Footer */}
                <Box customClass="gsm-footer">
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        disabled={!canStart}
                        onClick={canStart ? onStart : undefined}
                    >
                        Start Game
                        <ArrowRight size={18} strokeWidth={2} />
                    </Button>
                </Box>
            </motion.div>
        </motion.div>
    );
}
