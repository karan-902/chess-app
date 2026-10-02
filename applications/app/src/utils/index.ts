import { beatsYouText, beatsText } from "@gopvp/app/src/constants/message";
import { youBeatText } from "@gopvp/common/src/constants/message";
import { shortenUsername } from "@gopvp/common/src/util/format";
import { GAMES, type GameSlug } from "@gopvp/app/src/config/game";

export function isGameSlug(value: string | undefined): value is GameSlug {
 return !!value && Object.prototype.hasOwnProperty.call(GAMES, value);
}

export function getGameFromPath(pathname: string): GameSlug | null {
 const segment = pathname.split("/")[1];
 return isGameSlug(segment) ? segment : null;
}

export function getGamePath(game: GameSlug): string {
 return `/${game}`;
}

export function buildMatchUrl(game: GameSlug, matchId: string): string {
 return `${getGamePath(game)}?match_id=${matchId}`;
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

export function sanitizeAmountInput(value: string, max: number): string | null {
 const amount = value
  .replace(/,/g, ".")
  .replace(/[^0-9.]/g, "")
  .replace(/^0+/, "");
 return /^(\d+(\.\d{0,2})?)?$/.test(amount) && Number(amount) <= max
  ? amount
  : null;
}

export const endingBeforeQuery = (cursor: string | null) =>
 cursor ? `&ending_before=${encodeURIComponent(cursor)}` : "";
