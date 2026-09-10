const SOUND_FILES = {
    move: "/sounds/move.wav",
    capture: "/sounds/capture.wav",
    castle: "/sounds/castle.mp3",
    check: "/sounds/check.mp3",
    promote: "/sounds/promote.mp3",
    "game-end": "/sounds/game-end.mp3",
} as const;

export type SoundName = keyof typeof SOUND_FILES;

export function playSound(name: SoundName, volume = 0.5): void {
    const audio = new Audio(SOUND_FILES[name]);
    audio.volume = volume;
    audio.play().catch(() => {});
}

interface IMoveSoundInput {
    captured?: string;
    san: string;
    promotion?: string;
}

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
