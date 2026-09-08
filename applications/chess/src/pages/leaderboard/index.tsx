import classNames from "classnames";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Card from "@/components/base/Card/Card";
import EmptyState from "@/components/common/EmptyState";
import LbRowSkeleton from "@/components/common/LbRowSkeleton";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useReduxSelector } from "@/redux/hooks";
import { formatAmount } from "@/utils/format";
import { shortenUsername } from "@/utils";
import {
    leaderboardLoadError,
    leaderboardEmpty,
    leaderboardRankFallback,
    matchesYouLabel,
} from "@/constants/messages";

const LB_SKELETON_ROWS = 20;

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
                <EmptyState
                    description={error ? leaderboardLoadError : leaderboardEmpty}
                />
            ) : (
                <Box>
                    {!meInList && currentUserId && (
                        <Card customClass="lb-row me">
                            <Text customClass="lb-rank">
                                {leaderboardRankFallback}
                            </Text>
                            <Text customClass="lb-name row-title" truncate>
                                {currentUsername
                                    ? youLabel(currentUsername)
                                    : matchesYouLabel}
                            </Text>
                            <Text customClass="lb-earnings amount-value">
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
                            <Text customClass="lb-name row-title" truncate>
                                {isMe(player.id)
                                    ? youLabel(shortenUsername(player.username))
                                    : shortenUsername(player.username)}
                            </Text>
                            <Text customClass="lb-earnings amount-value">
                                {formatAmount(player.earnings)}
                            </Text>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}
