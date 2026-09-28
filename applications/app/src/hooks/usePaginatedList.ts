import { useCallback, useEffect, useRef, useState } from "react";
import { showApiErrorToast } from "@gopvp/common/src/util/api";
import type { IListResponse } from "@gopvp/common/src/types/response";

export function usePaginatedList<TItem>(
 fetchPage: (cursor: string | null) => Promise<IListResponse<TItem> | null>,
 enabled = true,
) {
 const [items, setItems] = useState<TItem[]>([]);
 const [loading, setLoading] = useState(true);
 const [loadingMore, setLoadingMore] = useState(false);
 const [error, setError] = useState(false);
 const [loadedFetchPage, setLoadedFetchPage] = useState<typeof fetchPage>();

 const hasMoreRef = useRef(true);
 const pageIdRef = useRef<string | null>(null);
 const isFetchingRef = useRef(false);
 const requestIdRef = useRef(0);

 const load = useCallback(
  async (isFirstLoad: boolean) => {
   if (!isFirstLoad && (isFetchingRef.current || !hasMoreRef.current)) return;

   const requestId = ++requestIdRef.current;
   isFetchingRef.current = true;
   (isFirstLoad ? setLoading : setLoadingMore)(true);
   setError(false);

   try {
    const res = await fetchPage(isFirstLoad ? null : pageIdRef.current);
    if (requestIdRef.current !== requestId) return;
    const data = res?.data ?? [];
    setItems((prev) => (isFirstLoad ? data : [...prev, ...data]));
    hasMoreRef.current = res?.has_more ?? false;
    pageIdRef.current = res?.page_id ?? null;
   } catch (err) {
    if (requestIdRef.current === requestId) setError(true);
    showApiErrorToast(err);
   } finally {
    isFetchingRef.current = false;
    if (requestIdRef.current === requestId) {
     (isFirstLoad ? setLoading : setLoadingMore)(false);
     setLoadedFetchPage(() => fetchPage);
    }
   }
  },
  [fetchPage],
 );

 useEffect(() => {
  if (enabled) load(true);
 }, [load, enabled]);

 const loadMore = useCallback(() => load(false), [load]);
 const refresh = useCallback(() => load(true), [load]);

 return {
  items,
  loading: loading || loadedFetchPage !== fetchPage,
  loadingMore,
  error,
  loadMore,
  refresh,
 };
}
