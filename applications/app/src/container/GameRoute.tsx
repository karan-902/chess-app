import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { GameContext } from "@gopvp/common/src/contexts/GameContext";
import SplitReveal from "@gopvp/common/src/components/SplitReveal/SplitReveal";
import type { GamePage } from "@gopvp/common/src/types/index";
import type { ISplitRevealTicket } from "@gopvp/common/src/types/component";
import { GAMES } from "@gopvp/app/src/config/game";
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
import { shouldReduceMotion } from "@gopvp/common/src/util/motion";

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
 const [revealTicket, setRevealTicket] = useState<ISplitRevealTicket | null>(
  null,
 );
 const startReveal = useCallback((ticket: HTMLElement) => {
  if (shouldReduceMotion()) return;
  const rect = ticket.getBoundingClientRect();
  const tearLine = ticket
   .querySelector("[data-tear-line]")
   ?.getBoundingClientRect();
  setRevealTicket({
   node: ticket.cloneNode(true) as HTMLElement,
   rect,
   tearY: tearLine ? tearLine.top - rect.top : rect.height / 2,
  });
 }, []);
 const finishReveal = useCallback(() => setRevealTicket(null), []);
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
   isRevealing: !!revealTicket,
   startReveal,
  }),
  [playPath, userId, username, socket, revealTicket, startReveal],
 );

 useEffect(() => {
  if (isInGame) dispatch(setActivePage("PLAY"));
 }, [isInGame, dispatch]);

 if (!isGameSlug(game)) return <EnteredGameRedirect />;
 const ActivePage = GAME_PAGE_COMPONENTS[isInGame ? "PLAY" : activePage];
 return (
  <GameContext.Provider value={gameContext}>
   <ActivePage />
   {revealTicket && (
    <SplitReveal
     ticket={revealTicket}
     Surface={GAMES[game].module.RevealSurface}
     onDone={finishReveal}
    />
   )}
  </GameContext.Provider>
 );
}
