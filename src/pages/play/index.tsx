import { Navigate, useNavigate, useSearchParams } from "react-router";
import PlayGamePage from "./PlayGamePage";
import type { Difficulty, GameMode, TimeControl } from "@/types/components";

export default function Play() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const mode        = params.get("mode")        as GameMode | null;
    const difficulty  = params.get("difficulty")  as Difficulty | null;
    const timeControl = params.get("time")        as TimeControl | null;
    const color       = params.get("color")       as "white" | "black" | null;
    const opponent    = params.get("opponent")    ?? undefined;
    const oppRating   = params.get("opp_rating");

    if (!mode || !timeControl) {
        return <Navigate to="/lobby" replace />;
    }

    return (
        <PlayGamePage
            mode={mode}
            difficulty={difficulty ?? "medium"}
            timeControl={timeControl}
            playerColor={color ?? undefined}
            opponentName={opponent}
            opponentRating={oppRating ? Number(oppRating) : undefined}
            onNewGame={() => navigate("/lobby")}
        />
    );
}
