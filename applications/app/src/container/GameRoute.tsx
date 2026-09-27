import { useMemo } from "react";
import { Outlet, useParams } from "react-router-dom";
import { GameContext } from "@gopvp/common/src/contexts/GameContext";
import EnteredGameRedirect from "@gopvp/app/src/container/EnteredGameRedirect";
import { useSocket } from "@gopvp/app/src/context/SocketContext";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { getGameRoutes, isGameSlug } from "@gopvp/app/src/utils";

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
