import { chessGame } from "@gopvp/chess/src/game";
import { chessText } from "@gopvp/common/src/constants/message";

export const GAMES = {
 chess: { label: chessText, module: chessGame },
} as const;

export type GameSlug = keyof typeof GAMES;
