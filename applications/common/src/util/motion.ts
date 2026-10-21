import { LOW_END_DEVICE_MEMORY_GB } from "@gopvp/common/src/constants/limit";

export const isLowEndDevice = () =>
 ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ??
  Infinity) <= LOW_END_DEVICE_MEMORY_GB;

export const shouldReduceMotion = () =>
 isLowEndDevice() ||
 window.matchMedia("(prefers-reduced-motion: reduce)").matches;
