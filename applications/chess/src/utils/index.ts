import type { GameCategory } from "@gopvp/chess/src/types/index";

export function oppositeSide(side: "w" | "b"): "w" | "b" {
 return side === "w" ? "b" : "w";
}
export function msToSeconds(ms: number): number {
 return ms / 1000;
}
export function deriveCategory(timeSeconds: number): GameCategory {
 if (timeSeconds <= 120) return "BULLET";
 if (timeSeconds <= 420) return "BLITZ";
 if (timeSeconds <= 1200) return "RAPID";
 return "CLASSICAL";
}
