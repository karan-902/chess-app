import { useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { GameContext } from "@gopvp/common/src/contexts/GameContext";
import type { GamePage } from "@gopvp/common/src/types/index";
import EnteredGameRedirect from "@gopvp/app/src/container/EnteredGameRedirect";
import PlayPage from "@gopvp/app/src/pages/play/PlayPage";
import MyMatches from "@gopvp/app/src/pages/history";
import Leaderboard from "@gopvp/app/src/pages/leaderboard";
import Rules from "@gopvp/app/src/pages/rules";
import { useSocket } from "@gopvp/app/src/context/SocketContext";
import { useReduxDispatch, useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { setActivePage } from "@gopvp/app/src/redux/game/slice";
import { getGamePath, isGameSlug } from "@gopvp/app/src/utils";
import { subscribeMatchResult } from "@gopvp/app/src/utils/matchResult";
import type { IMatchResultResponse } from "@gopvp/common/src/types/response";

const GAME_PAGE_COMPONENTS: Record<GamePage, () => React.ReactNode> = {
 PLAY: PlayPage,
 MATCHES: MyMatches,
 LEADERBOARD: Leaderboard,
 RULES: Rules,
};

export default function GameRoute() {
 const { game } = useParams();
 const [searchParams] = useSearchParams();
 const dispatch = useReduxDispatch();
 const { socket } = useSocket();
 const activePage = useReduxSelector((state) => state.game.activePage);
 const userId = useReduxSelector((state) => state.auth.session?.id);
 const username = useReduxSelector(
  (state) => state.auth.session?.username ?? "",
 );
 const isInGame =
  searchParams.has("match_id") || searchParams.has("practice_id");
 const playPath = isGameSlug(game) ? getGamePath(game) : "";
 const gameContext = useMemo(
  () => ({
   playPath,
   userId,
   username,
   socket,
   subscribeMatchResult: (
    matchId: string,
    onResult: (result: IMatchResultResponse) => void,
   ) => subscribeMatchResult(matchId, userId, onResult),
  }),
  [playPath, userId, username, socket],
 );

 useEffect(() => {
  if (isInGame) dispatch(setActivePage("PLAY"));
 }, [isInGame, dispatch]);

 if (!isGameSlug(game)) return <EnteredGameRedirect />;
 const ActivePage = GAME_PAGE_COMPONENTS[isInGame ? "PLAY" : activePage];
 return (
  <GameContext.Provider value={gameContext}>
   <ActivePage />
  </GameContext.Provider>
 );
}
