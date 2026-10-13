import type { GameCategory } from "@gopvp/chess/src/types/index";

export function oppositeSide(side: "w" | "b"): "w" | "b" {
 return side === "w" ? "b" : "w";
}
export function msToSeconds(ms: number): number {
 return ms / 1000;
}
export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export const smoothStep = (value: number) => {
 const p = clamp01(value);
 return p * p * (3 - 2 * p);
};
export const easeOutCubic = (value: number) => 1 - (1 - clamp01(value)) ** 3;
export const prefersReducedMotion = () =>
 window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export function deriveCategory(timeSeconds: number): GameCategory {
 if (timeSeconds <= 120) return "BULLET";
 if (timeSeconds <= 420) return "BLITZ";
 if (timeSeconds <= 1200) return "RAPID";
 return "CLASSICAL";
}
