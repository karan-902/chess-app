import { Navigate, useNavigate, useSearchParams } from "react-router";
import PlayGamePage from "./PlayGamePage";
import type { Difficulty, GameMode, TimeControl } from "@/types/components";

export default function Play() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const mode = params.get("mode") as GameMode | null;
    const difficulty = params.get("difficulty") as Difficulty | null;
    const timeControl = params.get("time") as TimeControl | null;
    const color = params.get("color") as "white" | "black" | null;
    const opponent = params.get("opponent") ?? undefined;
    const oppRating = params.get("opp_rating");
    const gameId = params.get("game_id") ?? undefined;
    const oppId = params.get("opp_id") ?? undefined;
    const oppAvatarSeed = params.get("opp_avatar_seed") || undefined;
    const initialTimeout = params.get("initial_timeout");
    const stakeAmount = params.get("stake_amount");

    if (!mode || !timeControl) {
        return <Navigate to="/lobby" replace />;
    }

    return (
        <PlayGamePage
            key={gameId}
            mode={mode}
            difficulty={difficulty ?? "medium"}
            timeControl={timeControl}
            playerColor={color ?? undefined}
            opponentName={opponent}
            opponentRating={oppRating ? Number(oppRating) : undefined}
            gameId={gameId}
            opponentId={oppId}
            opponentAvatarSeed={oppAvatarSeed}
            initialInactivitySeconds={
                initialTimeout ? Number(initialTimeout) : undefined
            }
            stakeAmount={stakeAmount ? Number(stakeAmount) : undefined}
            onNewGame={() => navigate("/lobby")}
        />
    );
}
