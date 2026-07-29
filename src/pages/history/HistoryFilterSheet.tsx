import { motion } from "motion/react";
import { X } from "lucide-react";
import clsx from "clsx";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import { CATEGORY_META } from "@/constants/config";
import {
    historyFilterSheetTitle,
    historyFilterResultLabel,
    historyFilterTimeControlLabel,
    historyFilterAll,
    historyFilterWins,
    historyFilterLosses,
    historyFilterDraws,
    historyFilterApplyButton,
} from "@/components/messages";
import type { GameCategory } from "@/types/types";

export type ResultFilter = "all" | "win" | "loss" | "draw";
export type TimeControlFilter = "all" | GameCategory;

const RESULT_OPTIONS: { value: ResultFilter; label: string }[] = [
    { value: "all", label: historyFilterAll },
    { value: "win", label: historyFilterWins },
    { value: "loss", label: historyFilterLosses },
    { value: "draw", label: historyFilterDraws },
];

const TIME_OPTIONS: { value: TimeControlFilter; label: string }[] = [
    { value: "all", label: historyFilterAll },
    { value: "bullet", label: `${CATEGORY_META.bullet.emoji} ${CATEGORY_META.bullet.label}` },
    { value: "blitz", label: `${CATEGORY_META.blitz.emoji} ${CATEGORY_META.blitz.label}` },
    { value: "rapid", label: `${CATEGORY_META.rapid.emoji} ${CATEGORY_META.rapid.label}` },
    { value: "classical", label: `${CATEGORY_META.classical.emoji} ${CATEGORY_META.classical.label}` },
];

interface IHistoryFilterSheetProps {
    result: ResultFilter;
    onResultChange: (value: ResultFilter) => void;
    timeControl: TimeControlFilter;
    onTimeControlChange: (value: TimeControlFilter) => void;
    onClose: () => void;
}

function HistoryFilterSheet({
    result,
    onResultChange,
    timeControl,
    onTimeControlChange,
    onClose,
}: IHistoryFilterSheetProps) {
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
                <Box customClass="gsm-header">
                    <Text as="span" customClass="gsm-modal-title">
                        {historyFilterSheetTitle}
                    </Text>
                    <Button
                        variant="outline"
                        size="sm"
                        customClass="gsm-close"
                        onClick={onClose}
                    >
                        <X size={16} />
                    </Button>
                </Box>

                <Box customClass="gsm-body">
                    <Text as="p" customClass="f-group-label">
                        {historyFilterResultLabel}
                    </Text>
                    <Box customClass="f-opt-row">
                        {RESULT_OPTIONS.map((option) => (
                            <Button
                                key={option.value}
                                variant="outline"
                                size="sm"
                                customClass={clsx(
                                    "f-opt",
                                    result === option.value && "active",
                                )}
                                onClick={() => onResultChange(option.value)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </Box>

                    <Text as="p" customClass="f-group-label">
                        {historyFilterTimeControlLabel}
                    </Text>
                    <Box customClass="f-opt-row">
                        {TIME_OPTIONS.map((option) => (
                            <Button
                                key={option.value}
                                variant="outline"
                                size="sm"
                                customClass={clsx(
                                    "f-opt",
                                    timeControl === option.value && "active",
                                )}
                                onClick={() => onTimeControlChange(option.value)}
                            >
                                {option.label}
                            </Button>
                        ))}
                    </Box>
                </Box>

                <Box customClass="gsm-footer">
                    <Button variant="primary" fullWidth onClick={onClose}>
                        {historyFilterApplyButton}
                    </Button>
                </Box>
            </motion.div>
        </motion.div>
    );
}

export default HistoryFilterSheet;
