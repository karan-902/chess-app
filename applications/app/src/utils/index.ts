import dayjs from "dayjs";
import { yesterdayText, justNowText } from "@gopvp/app/src/constants/message";
import { GAMES, type GameSlug } from "@gopvp/app/src/config/game";
import { GAME_PAGES } from "@gopvp/app/src/constants/route";

export function isGameSlug(value: string | undefined): value is GameSlug {
 return !!value && Object.prototype.hasOwnProperty.call(GAMES, value);
}

export function getGameFromPath(pathname: string): GameSlug | null {
 const segment = pathname.split("/")[1];
 return isGameSlug(segment) ? segment : null;
}

export function isGamePlayPath(pathname: string): boolean {
 const game = getGameFromPath(pathname);
 return !!game && pathname === getGameRoutes(game).PLAY;
}

export function getGameRoutes(game: GameSlug) {
 return Object.fromEntries(
  Object.entries(GAME_PAGES).map(([key, page]) => [key, `/${game}/${page}`]),
 ) as Record<keyof typeof GAME_PAGES, string>;
}

export function buildMatchUrl(game: GameSlug, matchId: string): string {
 return `${getGameRoutes(game).PLAY}?match=${matchId}`;
}
export function formatMatchDate(ms: number): string {
 const now = dayjs();
 const then = dayjs(ms);
 if (!then.isSame(now, "day")) {
  if (then.isSame(now.subtract(1, "day"), "day")) return yesterdayText;
  return then.format("MMMM D, YYYY");
 }
 const diffSeconds = now.diff(then, "second");
 if (diffSeconds < 60) return justNowText;
 const minutes = now.diff(then, "minute");
 if (minutes < 60) return `${minutes}m ago`;
 return `${now.diff(then, "hour")}h ago`;
}
