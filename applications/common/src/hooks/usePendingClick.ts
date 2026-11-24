import { useState } from "react";
import type { MouseEvent } from "react";
import type { TButtonClickHandler } from "@gopvp/common/src/types/component";

export function usePendingClick(onClick?: TButtonClickHandler) {
 const [isClickPending, setIsClickPending] = useState(false);
 const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
  const result = onClick?.(event);
  if (!(result instanceof Promise)) return;
  setIsClickPending(true);
  result.finally(() => setIsClickPending(false));
 };
 return { isClickPending, handleClick };
}
