

const AVATAR_STYLE = "adventurer";

export function getAvatarUrl(seed: string | null | undefined): string | undefined {
    if (!seed) return undefined;
    return `https://api.dicebear.com/9.x/${AVATAR_STYLE}/svg?seed=${encodeURIComponent(seed)}`;
}
