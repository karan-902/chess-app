import { useEffect, useState } from "react";
import { adminApiCall, getApiErrorMessage } from "@gopvp/admin/src/utils/api";

type TAdminGetResult<T> = {
 path: string;
 version: number;
 data: T | null;
 error: string;
};

export function useAdminGet<T>(path: string | null) {
 const [version, setVersion] = useState(0);
 const [result, setResult] = useState<TAdminGetResult<T> | null>(null);

 useEffect(() => {
  if (!path) return;
  let isCancelled = false;
  const load = async () => {
   try {
    const data = await adminApiCall<T>("GET", path);
    if (!isCancelled) setResult({ path, version, data, error: "" });
   } catch (error) {
    console.error(error);
    if (!isCancelled)
     setResult({
      path,
      version,
      data: null,
      error: getApiErrorMessage(error),
     });
   }
  };
  load();
  return () => {
   isCancelled = true;
  };
 }, [path, version]);

 const isSamePath = !!path && result?.path === path;
 return {
  data: isSamePath ? (result?.data ?? null) : null,
  error: isSamePath ? (result?.error ?? "") : "",
  isLoading: !!path && (!isSamePath || result?.version !== version),
  reload: () => setVersion((current) => current + 1),
 };
}
