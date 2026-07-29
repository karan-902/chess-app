import clsx from "clsx";
import Card from "../../components/base/Card/Card";
import Box from "../../components/base/Box/Box";
import Text from "../../components/base/Text/Text";
import Avatar from "../../components/base/Avatar/Avatar";
import { formateAmount } from "@/utils/formate";
import { getAvatarUrl } from "@/utils/avatar";
import {
    leaderboardTableRankHeader,
    leaderboardTablePlayerHeader,
    leaderboardTableRatingHeader,
    leaderboardTableEarningsHeader,
    leaderboardTableYouSuffix,
} from "@/components/messages";
import type { ILeaderboardPlayer } from "@/types/types";

interface ILeaderboardTableProps {
    players: ILeaderboardPlayer[];
    currentUserId?: string;
    loading?: boolean;
}

function LeaderboardTable({
    players,
    currentUserId,
    loading,
}: ILeaderboardTableProps) {
    return (
        <Card customClass="leaderboard-table hud-frame">
            <Box customClass="leaderboard-header">
                <Text
                    font="mono"
                    size={10}
                    color="muted"
                    uppercase
                    customClass="col-rank"
                >
                    {leaderboardTableRankHeader}
                </Text>
                <Text
                    font="mono"
                    size={10}
                    color="muted"
                    uppercase
                    customClass="col-player"
                >
                    {leaderboardTablePlayerHeader}
                </Text>
                <Text
                    font="mono"
                    size={10}
                    color="muted"
                    uppercase
                    customClass="col-rating"
                >
                    {leaderboardTableRatingHeader}
                </Text>
                <Text
                    font="mono"
                    size={10}
                    color="muted"
                    uppercase
                    customClass="col-earnings"
                >
                    {leaderboardTableEarningsHeader}
                </Text>
            </Box>
            {loading
                ? Array.from({ length: 7 }, (_, i) => (
                      <Box key={i} customClass="leaderboard-row--skeleton" />
                  ))
                : players.map((player) => {
                      const isYou = player.id === currentUserId;
                      return (
                          <Box
                              key={player.id}
                              customClass={clsx(
                                  "leaderboard-row",
                                  isYou && "you",
                              )}
                          >
                              <Text as="span" customClass="col-rank">
                                  {player.rank}
                              </Text>
                              <Box customClass="col-player player-cell">
                                  <Avatar
                                      letter={
                                          player.username[0]?.toUpperCase() ??
                                          "?"
                                      }
                                      src={getAvatarUrl(player.avatar_seed)}
                                      size="sm"
                                      variant="neutral"
                                  />
                                  <Box customClass="player-details">
                                      <Text
                                          as="span"
                                          font="inter"
                                          size={14}
                                          color="white"
                                          truncate
                                          customClass={clsx(
                                              "player-name",
                                              isYou && "you",
                                          )}
                                      >
                                          {player.username}
                                          {isYou && (
                                              <Text
                                                  as="span"
                                                  font="mono"
                                                  size={10}
                                                  color="muted"
                                              >
                                                  {" "}
                                                  {leaderboardTableYouSuffix}
                                              </Text>
                                          )}
                                      </Text>
                                      <Text font="mono" size={10} color="muted">
                                          {player.country}
                                      </Text>
                                  </Box>
                              </Box>
                              <Text
                                  font="mono"
                                  size={14}
                                  color="white"
                                  customClass="col-rating"
                              >
                                  {player.elo_rating}
                              </Text>
                              <Text
                                  font="mono"
                                  size={14}
                                  weight={700}
                                  color="accent"
                                  customClass="col-earnings earnings-value"
                              >
                                  {formateAmount(player.earnings, "USD")}
                              </Text>
                          </Box>
                      );
                  })}
        </Card>
    );
}

export default LeaderboardTable;
