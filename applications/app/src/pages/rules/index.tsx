import { Suspense } from "react";
import { useGame } from "@gopvp/app/src/hooks/useGame";

export default function Rules() {
    const {
        gameModule: { Rules: GameRules },
    } = useGame();
    return (
        <Suspense fallback={null}>
            <GameRules />
        </Suspense>
    );
}
