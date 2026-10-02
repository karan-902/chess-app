import { useEffect, useState } from "react";

let hasBeenReady = false;

export function useSheetReady(open: boolean) {
 const [ready, setReady] = useState(false);

 useEffect(() => {
  if (!open || hasBeenReady) return;
  const timer = setTimeout(() => {
   hasBeenReady = true;
   setReady(true);
  }, 1000);
  return () => clearTimeout(timer);
 }, [open]);

 return ready || hasBeenReady;
}
