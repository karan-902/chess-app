export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
export const easeOutCubic = (value: number) => 1 - (1 - clamp01(value)) ** 3;
