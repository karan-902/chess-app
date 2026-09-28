import { chessGame } from "@gopvp/chess/src/game";

export const GAMES = {
 chess: { label: "Chess", module: chessGame },
} as const;

export type GameSlug = keyof typeof GAMES;
