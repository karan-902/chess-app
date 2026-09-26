import { useEffect, useState } from "react";

export function useCountdown(deadlineAt: number | null) {
 const [, setTick] = useState(0);

 useEffect(() => {
  if (deadlineAt === null) return;
  const id = setInterval(() => {
   setTick((tick) => tick + 1);
   if (Date.now() >= deadlineAt) clearInterval(id);
  }, 1000);
  return () => clearInterval(id);
 }, [deadlineAt]);

 return deadlineAt === null
  ? null
  : Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000));
}
