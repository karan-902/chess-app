import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Sprout, TrendingUp, Award, Crown, Check } from "lucide-react";
import clsx from "clsx";
import Box from "@/components/base/Box/Box";
import Card from "@/components/base/Card/Card";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";

import { callAPIInterface } from "@/utils";
import { useReduxDispatch } from "@/store/hooks";
import { updateSession } from "@/store/persisted/auth.slice";
import {
    skillLevelEyebrow,
    skillLevelTitle,
    skillLevelSubtitle,
    skillLevelEloSuffix,
    skillLevelContinueButton,
    skillLevelAlreadyPlayedError,
    skillLevelSetFailedTitle,
    skillLevelSetFailedDescription,
} from "@/components/messages";
import type {
    ISetSkillLevelBody,
    ISetSkillLevelResponse,
    SkillLevel,
} from "@/types/utils";

const LEVELS: {
    key: SkillLevel;
    label: string;
    elo: number;
    desc: string;
    icon: React.ReactNode;
}[] = [
    {
        key: "beginner",
        label: "Beginner",
        elo: 400,
        desc: "New to chess or just starting out",
        icon: <Sprout size={18} strokeWidth={1.6} />,
    },
    {
        key: "intermediate",
        label: "Intermediate",
        elo: 800,
        desc: "Know the rules, play casually",
        icon: <TrendingUp size={18} strokeWidth={1.6} />,
    },
    {
        key: "advanced",
        label: "Advanced",
        elo: 1200,
        desc: "Solid strategy, played competitively",
        icon: <Award size={18} strokeWidth={1.6} />,
    },
    {
        key: "expert",
        label: "Expert",
        elo: 1600,
        desc: "Tournament-level experience",
        icon: <Crown size={18} strokeWidth={1.6} />,
    },
];

export default function SkillLevelPage() {
    const [selected, setSelected] = useState<SkillLevel | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const dispatch = useReduxDispatch();

    const handleContinue = async () => {
        if (!selected) return;
        setSubmitting(true);
        try {
            const res = await callAPIInterface<
                ISetSkillLevelBody,
                ISetSkillLevelResponse
            >("POST", "/profile/skill-level", { skill_level: selected });
            dispatch(
                updateSession({
                    skill_level: res.skill_level,
                    elo_rating: res.elo_rating,
                }),
            );
            navigate("/lobby", { replace: true });
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response
                ?.status;
            if (status === 403) {
                toast.error(skillLevelAlreadyPlayedError);
                navigate("/lobby", { replace: true });
            } else {
                toast.error(skillLevelSetFailedTitle, {
                    description: skillLevelSetFailedDescription,
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box customClass="skill-level-page">
            <Box customClass="lobby-heading">
                <Text as="p" customClass="lobby-eyebrow">
                    {skillLevelEyebrow}
                </Text>
                <Text as="h1" customClass="lobby-heading-title">
                    {skillLevelTitle}
                </Text>
                <Text as="p" customClass="lobby-heading-sub">
                    {skillLevelSubtitle}
                </Text>
            </Box>

            <Box customClass="skill-ladder">
                {LEVELS.map(({ key, label, elo, desc, icon }) => (
                    <Card
                        key={key}
                        customClass={clsx(
                            "skill-rung",
                            selected === key && "active",
                        )}
                        onClick={() => setSelected(key)}
                    >
                        <Box customClass="skill-rung-dot">
                            {selected === key ? (
                                <Check size={14} strokeWidth={3} />
                            ) : (
                                icon
                            )}
                        </Box>
                        <Box customClass="skill-rung-info">
                            <Text as="span" customClass="skill-rung-title">
                                {label}
                            </Text>
                            <Text as="span" customClass="skill-rung-desc">
                                {desc}
                            </Text>
                        </Box>
                        <Text as="span" customClass="skill-rung-elo">
                            {skillLevelEloSuffix(elo)}
                        </Text>
                    </Card>
                ))}
            </Box>

            <Button
                variant="primary"
                size="lg"
                fullWidth
                disabled={!selected}
                isLoading={submitting}
                onClick={handleContinue}
                customClass="skill-level-continue-btn"
            >
                {skillLevelContinueButton}
            </Button>
        </Box>
    );
}
