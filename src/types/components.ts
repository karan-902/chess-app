export type GameMode = "pvp" | "pvc";
export type Difficulty = "easy" | "medium" | "hard";
export type TimeControl = "bullet" | "blitz" | "rapid" | "classical";
export type GamePhase = "lobby" | "playing";

export const TIME_SECONDS: Record<TimeControl, number> = {
    bullet: 60,
    blitz: 300,
    rapid: 600,
    classical: 1800,
};

export function secondsToTimeControl(seconds: number): TimeControl {
    const match = (
        Object.entries(TIME_SECONDS) as [TimeControl, number][]
    ).find(([, s]) => s === seconds);
    return match?.[0] ?? "rapid";
}

export function getInactivitySeconds(timeSeconds: number): number {
    if (timeSeconds <= 60) return 15; // bullet
    if (timeSeconds <= 180) return 30; // blitz
    if (timeSeconds <= 600) return 60; // rapid
    return 90;
}

export const DIFFICULTY_CONFIG: Record<
    Difficulty,
    { rating: number; depth: number; elo: number }
> = {
    easy: { rating: 100, depth: 2, elo: 100 },
    medium: { rating: 1600, depth: 8, elo: 1600 },
    hard: { rating: 3000, depth: 18, elo: 3000 },
};
