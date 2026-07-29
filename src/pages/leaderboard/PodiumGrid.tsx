import clsx from "clsx";
import Box from "../../components/base/Box/Box";
import Card from "../../components/base/Card/Card";
import Text from "../../components/base/Text/Text";
import Avatar from "../../components/base/Avatar/Avatar";
import { formateAmount } from "@/utils/formate";
import { getAvatarUrl } from "@/utils/avatar";
import type { ILeaderboardPlayer } from "@/types/types";

const STEP_ORDER: Record<number, "1" | "2" | "3"> = { 0: "2", 1: "1", 2: "3" };

interface IPodiumGridProps {
    players: ILeaderboardPlayer[];
    loading?: boolean;
}

function PodiumGrid({ players, loading }: IPodiumGridProps) {
    if (loading) {
        return (
            <Box customClass="podium-wrap">
                {[0, 1, 2].map((i) => (
                    <Box
                        key={i}
                        customClass={clsx(
                            "podium-step--skeleton",
                            `podium-step--${STEP_ORDER[i]}`,
                        )}
                    />
                ))}
            </Box>
        );
    }

    const top3 = players.slice(0, 3);

    return (
        <Box customClass="podium-wrap">
            {top3.map((player, i) => (
                <Card
                    key={player.id}
                    customClass={clsx(
                        "podium-step",
                        `podium-step--${STEP_ORDER[i]}`,
                    )}
                >
                    <Text
                        as="span"
                        customClass={clsx(
                            "podium-step-rank",
                            `rank-${STEP_ORDER[i]}`,
                        )}
                    >
                        {player.rank}
                    </Text>
                    <Avatar
                        letter={player.username[0]?.toUpperCase() ?? "?"}
                        src={getAvatarUrl(player.avatar_seed)}
                        size="sm"
                        variant="neutral"
                    />
                    <Text
                        font="inter"
                        size={12}
                        weight={700}
                        color="white"
                        truncate
                        customClass="podium-name"
                    >
                        {player.username}
                    </Text>
                    <Text
                        font="mono"
                        size={11}
                        weight={700}
                        color="accent"
                        customClass="podium-earnings"
                    >
                        {formateAmount(player.earnings, "USD")}
                    </Text>
                </Card>
            ))}
        </Box>
    );
}

export default PodiumGrid;
