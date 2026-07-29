const SOUND_FILES = {
    move: "/sounds/move.mp3",
    capture: "/sounds/capture.mp3",
    castle: "/sounds/castle.mp3",
    check: "/sounds/check.mp3",
    promote: "/sounds/promote.mp3",
    "game-start": "/sounds/game-start.mp3",
    "game-end": "/sounds/game-end.mp3",
} as const;

export type SoundName = keyof typeof SOUND_FILES;

const audioCache = new Map<SoundName, HTMLAudioElement>();

/** Plays a sound by name. Clones the cached element so overlapping rapid
 * plays (e.g. a move immediately followed by check) don't cut each other off. */
export function playSound(name: SoundName, volume = 0.5): void {
    let base = audioCache.get(name);
    if (!base) {
        base = new Audio(SOUND_FILES[name]);
        audioCache.set(name, base);
    }
    const instance = base.cloneNode(true) as HTMLAudioElement;
    instance.volume = volume;
    // Autoplay can reject before the first user gesture — ignore, not fatal.
    instance.play().catch(() => {});
}

interface IMoveSoundInput {
    captured?: string;
    san: string;
    promotion?: string;
}

/** Picks the right sound for a chess.js move result, mirroring chess.com's
 * priority order: game-over > check > promotion > castle > capture > move. */
export function getMoveSound(
    move: IMoveSoundInput,
    isCheck: boolean,
    isGameOver: boolean,
): SoundName {
    if (isGameOver) return "game-end";
    if (isCheck) return "check";
    if (move.promotion) return "promote";
    if (move.san.startsWith("O-O")) return "castle";
    if (move.captured) return "capture";
    return "move";
}
