// Avatars are rendered from DiceBear (https://www.dicebear.com) — we only
// ever persist a `seed`; the image itself is generated on the fly from
// style + seed. Keep AVATAR_STYLE in sync with chess-backend's
// src/constants/avatar.constants.ts.
const AVATAR_STYLE = "adventurer";

export function getAvatarUrl(seed: string | null | undefined): string | undefined {
    if (!seed) return undefined;
    return `https://api.dicebear.com/9.x/${AVATAR_STYLE}/svg?seed=${encodeURIComponent(seed)}`;
}
