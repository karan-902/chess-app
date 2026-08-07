import classNames from "classnames";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Card from "@/components/base/Card/Card";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useReduxSelector } from "@/redux/hooks";
import { formateAmount } from "@/utils/formate";
import {
    leaderboardLoadError,
    leaderboardEmpty,
    leaderboardRankFallback,
    matchesYouLabel,
} from "@/constants/messages";

const LB_SKELETON_ROWS = 20;

function LbRowSkeleton() {
    return (
        <Card customClass="lb-row">
            <Skeleton
                variant="circular"
                width={22}
                height={22}
                customClass="circular"
            />
            <Skeleton
                customClass="text"
                width="45%"
                height={14}
                style={{ flex: 1 }}
            />
            <Skeleton customClass="text" width={30} height={13} />
        </Card>
    );
}

function lbSkeletonRows() {
    return Array.from({ length: LB_SKELETON_ROWS }, (_, index) => (
        <LbRowSkeleton key={index} />
    ));
}

export default function Leaderboard() {
    const { players, loading, error } = useLeaderboard();
    const currentUserId = useReduxSelector((state) => state.auth.session?.id);
    const currentUsername = useReduxSelector(
        (state) => state.auth.session?.username,
    );

    const isMe = (id: string) => id === currentUserId;
    const meInList = players.some((p) => isMe(p.id));
    const youLabel = (username: string) => `${username}(${matchesYouLabel})`;

    return (
        <Box customClass="leaderboard-page">
            {loading ? (
                <Box>{lbSkeletonRows()}</Box>
            ) : players.length === 0 ? (
                <Box customClass="matches-empty">
                    <Text customClass="matches-empty-desc">
                        {error ? leaderboardLoadError : leaderboardEmpty}
                    </Text>
                </Box>
            ) : (
                <Box>
                    {!meInList && currentUserId && (
                        <Card customClass="lb-row me">
                            <Text customClass="lb-rank">
                                {leaderboardRankFallback}
                            </Text>
                            <Text customClass="lb-name">
                                {currentUsername
                                    ? youLabel(currentUsername)
                                    : matchesYouLabel}
                            </Text>
                            <Text customClass="lb-earnings">
                                {leaderboardRankFallback}
                            </Text>
                        </Card>
                    )}
                    {players.map((player) => (
                        <Card
                            key={player.id}
                            customClass={classNames(
                                "lb-row",
                                isMe(player.id) && "me",
                            )}
                        >
                            <Text
                                customClass={classNames("lb-rank", {
                                    gold: player.rank === 1,
                                    silver: player.rank === 2,
                                    bronze: player.rank === 3,
                                })}
                            >
                                {player.rank}
                            </Text>
                            <Text customClass="lb-name">
                                {isMe(player.id)
                                    ? youLabel(player.username)
                                    : player.username}
                            </Text>
                            <Text customClass="lb-earnings">
                                {formateAmount(player.earnings)}
                            </Text>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}
