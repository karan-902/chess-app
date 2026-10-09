import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import { icons } from "@gopvp/common/src/components/images";
import { useLiveWins } from "@gopvp/app/src/hooks/useLiveWins";
import {
 formatAmount,
 formatTimeAgo,
 shortenUsername,
} from "@gopvp/common/src/util/format";
import type { IWorldMatchHistoryResponse } from "@gopvp/common/src/types/response";
import { readStorage, writeStorage } from "@gopvp/common/src/util/storage";
import { wonText } from "@gopvp/app/src/constants/message";
import { LAST_LIVE_WIN_STORAGE_KEY } from "@gopvp/app/src/constants/storageKey";
import {
 LIVE_WIN_SHOW_MS,
 LIVE_WIN_EXIT_MS,
 LIVE_WIN_MAX_AGE_MS,
} from "@gopvp/app/src/constants/limit";

export default function LiveWinsTicker() {
 const { liveWins } = useLiveWins();
 const seenIdsRef = useRef<Set<string> | null>(null);
 const [queue, setQueue] = useState<IWorldMatchHistoryResponse[]>([]);
 const [isLeaving, setIsLeaving] = useState(false);
 const win = queue[0];

 useEffect(() => {
  if (liveWins.length === 0) return;
  const seenIds = seenIdsRef.current;
  if (!seenIds) {
   seenIdsRef.current = new Set(liveWins.map(({ id }) => id));
   const [latest] = liveWins;
   const isFresh = Date.now() - latest.created < LIVE_WIN_MAX_AGE_MS;
   const isUnseen =
    latest.id !== readStorage(sessionStorage, LAST_LIVE_WIN_STORAGE_KEY);
   if (isFresh && isUnseen) setQueue([latest]);
   return;
  }
  const freshWins = liveWins.filter(({ id }) => !seenIds.has(id));
  freshWins.forEach(({ id }) => seenIds.add(id));
  if (freshWins.length) setQueue((q) => [...q, ...freshWins.reverse()]);
 }, [liveWins]);

 useEffect(() => {
  if (!win) return;
  writeStorage(sessionStorage, LAST_LIVE_WIN_STORAGE_KEY, win.id);
  const leaveTimer = setTimeout(() => setIsLeaving(true), LIVE_WIN_SHOW_MS);
  const nextTimer = setTimeout(() => {
   setIsLeaving(false);
   setQueue((q) => q.slice(1));
  }, LIVE_WIN_SHOW_MS + LIVE_WIN_EXIT_MS);
  return () => {
   clearTimeout(leaveTimer);
   clearTimeout(nextTimer);
  };
 }, [win]);

 return (
  <Box customClass="live-wins-ticker" aria-live="polite">
   {win && (
    <Text
     key={win.id}
     customClass={classNames("live-win-line", isLeaving && "leaving")}
    >
     <icons.trophy />
     <Text component="span" customClass="live-win-name">
      {shortenUsername(win.winner)}
     </Text>
     {wonText}
     <Text component="span" customClass="live-win-amount">
      {formatAmount(win.amount)}
     </Text>
     <Text component="span" customClass="live-win-time">
      {formatTimeAgo(win.created)}
     </Text>
    </Text>
   )}
  </Box>
 );
}
