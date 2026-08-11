import { GameCategory } from "./types";

export type GameMode = "pvp" | "pvc";
export type Difficulty = "easy" | "medium" | "hard";
export type TimeControl = "bullet" | "blitz" | "rapid" | "classical";
export type GamePhase = "lobby" | "playing";

export const TIME_SECONDS: Record<GameCategory, number> = {
    BULLET: 60,
    BLITZ: 180,
    RAPID: 600,
    CLASSICAL: 1800,
};

export interface IEmailFormValues {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm: string;
    country: string;
}

export interface IEmailFormScreenProps {
    onBack: () => void;
    onRegistered: (email: string, password: string) => void;
}

export function secondsToTimeControl(seconds: number): TimeControl {
    const match = (
        Object.entries(TIME_SECONDS) as [TimeControl, number][]
    ).find(([, s]) => s === seconds);
    return match?.[0] ?? "rapid";
}

export function getInactivitySeconds(timeSeconds: number): number {
    if (timeSeconds <= 60) return 15;
    if (timeSeconds <= 180) return 30;
    if (timeSeconds <= 600) return 60;
    return 90;
}

export const CATEGORY_INACTIVITY_SECONDS: Record<TimeControl, number> = {
    bullet: 15,
    blitz: 30,
    rapid: 60,
    classical: 90,
};

export const DIFFICULTY_CONFIG: Record<
    Difficulty,
    { rating: number; depth: number; elo: number }
> = {
    easy: { rating: 100, depth: 2, elo: 100 },
    medium: { rating: 1600, depth: 4, elo: 1600 },
    hard: { rating: 3000, depth: 8, elo: 3000 },
};
