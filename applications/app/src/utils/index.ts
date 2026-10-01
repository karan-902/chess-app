import { beatsYouText, beatsText } from "@gopvp/app/src/constants/message";
import { youBeatText } from "@gopvp/common/src/constants/message";
import { shortenUsername } from "@gopvp/common/src/util/format";
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

export function getWorldMatchHeadline(
 winner: string,
 loser: string,
 currentUsername?: string,
): string {
 if (winner === currentUsername) return youBeatText(shortenUsername(loser));
 if (loser === currentUsername) return beatsYouText(shortenUsername(winner));
 return beatsText(shortenUsername(winner), shortenUsername(loser));
}

export const endingBeforeQuery = (cursor: string | null) =>
 cursor ? `&ending_before=${encodeURIComponent(cursor)}` : "";
