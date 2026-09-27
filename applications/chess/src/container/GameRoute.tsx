import { useMemo } from "react";
import { Outlet, useParams } from "react-router-dom";
import { GameContext } from "@gopvp/common/src/contexts/GameContext";
import EnteredGameRedirect from "@gopvp/chess/src/container/EnteredGameRedirect";
import { useSocket } from "@gopvp/chess/src/context/SocketContext";
import { useReduxSelector } from "@gopvp/chess/src/redux/hooks";
import { getGameRoutes, isGameSlug } from "@gopvp/chess/src/utils";

export default function GameRoute() {
    const { game } = useParams();
    const { socket } = useSocket();
    const userId = useReduxSelector((state) => state.auth.session?.id);
    const username = useReduxSelector((state) => state.auth.session?.username ?? "");
    const playPath = isGameSlug(game) ? getGameRoutes(game).PLAY : "";
    const gameContext = useMemo(
        () => ({ playPath, userId, username, socket }),
        [playPath, userId, username, socket],
    );

    if (!isGameSlug(game)) return <EnteredGameRedirect />;
    return (
        <GameContext.Provider value={gameContext}>
            <Outlet />
        </GameContext.Provider>
    );
}
