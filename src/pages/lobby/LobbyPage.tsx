import { Link } from "react-router";
import { User, Monitor } from "lucide-react";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import MatchStats from "@/pages/matchmaking/MatchStats";
import { useSocket } from "@/context/SocketContext";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { usePools } from "@/hooks/usePools";

import {
    lobbyTitle,
    lobbySubtitle,
    lobbyGameModeSectionTitle,
    lobbyLiveActivitySectionTitle,
    lobbyPvpTitle,
    lobbyPvpDesc,
    lobbyPvcTitle,
    lobbyPvcDesc,
    lobbyEyebrow,
    lobbyOnlineNowSuffix,
    lobbyLiveWinsSectionTitle,
    lobbyLiveWinsEmptyText,
    lobbyTopRankedSectionTitle,
    lobbyViewLeaderboard,
    lobbyPvpBadge,
} from "@/components/messages";
import type { GameMode } from "@/types/components";
import { formateAmount } from "@/utils/formate";

interface ILobbyViewProps {
    onModeSelect: (m: GameMode) => void;
}

const RANK_MEDAL = ["♛", "♛", "♛"];

function initials(username: string) {
    return username.slice(0, 2).toUpperCase();
}

export default function LobbyPage({ onModeSelect }: ILobbyViewProps) {
    const { userCounts, recentWins } = useSocket();
    const { stats } = usePools();
    const { players } = useLeaderboard();
    const topPlayers = players.slice(0, 3);
    const winsLoop = recentWins.length ? [...recentWins, ...recentWins] : [];

    return (
        <Box customClass="lobby-page">
            <Box customClass="lobby-heading">
                <Text as="p" customClass="lobby-eyebrow">
                    {lobbyEyebrow}
                </Text>
                <Text as="h1" customClass="lobby-heading-title">
                    {lobbyTitle}
                </Text>
                <Text as="p" customClass="lobby-heading-sub">
                    {lobbySubtitle}
                </Text>
            </Box>

            <Box customClass="lobby-livebar lobby-livebar--mobile">
                <span>
                    <span className="live-dot" /> <b>{userCounts.active}</b>{" "}
                    {lobbyOnlineNowSuffix}
                </span>
            </Box>

            <Box customClass="lobby-dashboard-grid">
                <Box customClass="lobby-main-col">
                    <Box customClass="lobby-section">
                        <Text as="span" customClass="section-title">
                            {lobbyGameModeSectionTitle}
                        </Text>
                        <Box customClass="mode-grid">
                            <button
                                className="mode-card pvp hud-frame"
                                onClick={() => onModeSelect("pvp")}
                            >
                                <span className="mode-badge">
                                    {lobbyPvpBadge}
                                </span>
                                <span className="mode-icon-wrap">
                                    <User size={24} strokeWidth={1.5} />
                                </span>
                                <span className="mode-title">
                                    {lobbyPvpTitle}
                                </span>
                                <span className="mode-desc">
                                    {lobbyPvpDesc}
                                </span>
                            </button>

                            <button
                                className="mode-card pvc hud-frame"
                                onClick={() => onModeSelect("pvc")}
                            >
                                <span className="mode-icon-wrap">
                                    <Monitor size={24} strokeWidth={1.5} />
                                </span>
                                <span className="mode-title">
                                    {lobbyPvcTitle}
                                </span>
                                <span className="mode-desc">
                                    {lobbyPvcDesc}
                                </span>
                            </button>
                        </Box>
                    </Box>

                    <Box customClass="lobby-section lobby-live-activity">
                        <Text as="span" customClass="section-title">
                            {lobbyLiveActivitySectionTitle}
                        </Text>
                        <MatchStats online={userCounts.active} stats={stats} />
                    </Box>
                </Box>

                <Box customClass="lobby-rail-col">
                    <Box customClass="lobby-section">
                        <Text as="span" customClass="section-title">
                            {lobbyLiveWinsSectionTitle}
                        </Text>
                        {recentWins.length > 0 ? (
                            <Box customClass="wins-ticker hud-frame">
                                <Box customClass="wins-track">
                                    {winsLoop.map((win, i) => (
                                        <span
                                            className="win-item"
                                            key={`${win.winner_id}-${i}`}
                                        >
                                            <span className="win-avatar">
                                                {initials(win.winner_username)}
                                            </span>
                                            {win.winner_username}{" "}
                                            <b className="win-amt">
                                                +
                                                {formateAmount(
                                                    win.prize_usd,
                                                    "USD",
                                                )}
                                            </b>
                                        </span>
                                    ))}
                                </Box>
                            </Box>
                        ) : (
                            <Box customClass="wins-ticker wins-ticker--empty hud-frame">
                                <Text as="span" customClass="wins-empty-text">
                                    {lobbyLiveWinsEmptyText}
                                </Text>
                            </Box>
                        )}
                    </Box>

                    {topPlayers.length > 0 && (
                        <Box customClass="lobby-section">
                            <Text as="span" customClass="section-title">
                                {lobbyTopRankedSectionTitle}
                            </Text>
                            <Box customClass="lb-teaser hud-frame">
                                {topPlayers.map((player, i) => (
                                    <Box customClass="lb-row" key={player.id}>
                                        <span
                                            className={`lb-rank lb-rank--${i + 1}`}
                                        >
                                            {RANK_MEDAL[i]}
                                        </span>
                                        <span className="lb-name">
                                            {player.username}
                                        </span>
                                        <span className="lb-rating">
                                            {player.elo_rating}
                                        </span>
                                        <span className="lb-earnings">
                                            {formateAmount(
                                                player.earnings,
                                                "USD",
                                            )}
                                        </span>
                                    </Box>
                                ))}
                                <Link to="/leaderboard" className="lb-viewall">
                                    {lobbyViewLeaderboard}
                                </Link>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
