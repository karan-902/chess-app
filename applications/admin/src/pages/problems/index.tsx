import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import { CustomSelect } from "@gopvp/common/src/components/Select/Select";
import { CustomTab, CustomTabs } from "@gopvp/common/src/components/Tabs/Tabs";
import { RefreshCw05 } from "@gopvp/common/src/components/images";
import {
 formatDateTime,
 formatTimeAgo,
 formatUtcDateTime,
} from "@gopvp/common/src/util/format";
import {
 ADMIN_ENDPOINTS,
 ADMIN_ISSUE_STATUS,
} from "@gopvp/admin/src/constants/endpoint";
import { ISSUE_TYPE_LABELS } from "@gopvp/admin/src/constants/label";
import { PROBLEMS_SKELETON_ROWS } from "@gopvp/admin/src/constants/limit";
import { ISSUE_TYPE_OPTIONS } from "@gopvp/admin/src/constants/option";
import { problemPath } from "@gopvp/admin/src/constants/route";
import {
 allTypesText,
 detailsText,
 foundText,
 lastSpeedCheckText,
 loadMoreText,
 noOpenProblemsText,
 noResolvedProblemsText,
 notRunYetText,
 openCountText,
 openText,
 problemText,
 problemsHintText,
 problemsText,
 recordText,
 resolvedText,
 speedCheckSummaryText,
} from "@gopvp/admin/src/constants/message";
import { useAdminGet } from "@gopvp/admin/src/hooks/useAdminGet";
import { useToast } from "@gopvp/admin/src/context/ToastContext";
import { adminApiCall, getApiErrorMessage } from "@gopvp/admin/src/utils/api";
import { isSpeedCheckStale } from "@gopvp/admin/src/utils/status";
import ErrorNotice from "@gopvp/admin/src/components/ErrorNotice";
import type {
 TAdminDashboardNow,
 TAdminIssue,
 TAdminList,
} from "@gopvp/admin/src/types";

type TIssuePages = {
 path: string;
 items: TAdminIssue[];
 pageId: string | null;
 hasMore: boolean;
 error: string;
};

function useIssuePages(path: string) {
 const showToast = useToast();
 const [pages, setPages] = useState<TIssuePages | null>(null);
 const [isLoadingMore, setIsLoadingMore] = useState(false);

 useEffect(() => {
  let isCancelled = false;
  const load = async () => {
   try {
    const page = await adminApiCall<TAdminList<TAdminIssue> | null>(
     "GET",
     path,
    );
    if (!isCancelled)
     setPages({
      path,
      items: page?.data ?? [],
      pageId: page?.page_id ?? null,
      hasMore: !!page?.has_more,
      error: "",
     });
   } catch (error) {
    console.error(error);
    if (!isCancelled)
     setPages({
      path,
      items: [],
      pageId: null,
      hasMore: false,
      error: getApiErrorMessage(error),
     });
   }
  };
  load();
  return () => {
   isCancelled = true;
  };
 }, [path]);

 const current = pages?.path === path ? pages : null;

 const loadMore = async () => {
  if (!current?.pageId || isLoadingMore) return;
  setIsLoadingMore(true);
  try {
   const page = await adminApiCall<TAdminList<TAdminIssue> | null>(
    "GET",
    `${path}&ending_before=${encodeURIComponent(current.pageId)}`,
   );
   setPages((previous) =>
    previous?.path === path
     ? {
        ...previous,
        items: [...previous.items, ...(page?.data ?? [])],
        pageId: page?.page_id ?? null,
        hasMore: !!page?.has_more,
       }
     : previous,
   );
  } catch (error) {
   showToast({
    toastMessage: getApiErrorMessage(error),
    toastVariant: "error",
   });
  } finally {
   setIsLoadingMore(false);
  }
 };

 return {
  items: current?.items ?? [],
  hasMore: !!current?.hasMore,
  error: current?.error ?? "",
  isLoading: !current,
  isLoadingMore,
  loadMore,
 };
}

export default function Problems() {
 const [searchParams, setSearchParams] = useSearchParams();
 const status = searchParams.get("status") ?? ADMIN_ISSUE_STATUS.OPEN;
 const type = searchParams.get("type") ?? "";
 const nowRequest = useAdminGet<TAdminDashboardNow>(
  ADMIN_ENDPOINTS.DASHBOARD_NOW,
 );
 const list = useIssuePages(
  `${ADMIN_ENDPOINTS.ISSUES}?status=${status}${type ? `&type=${type}` : ""}`,
 );
 const lastCheck = nowRequest.data?.last_check;
 const openCount = nowRequest.data?.open_problems;
 const isCheckStale = isSpeedCheckStale(lastCheck);

 const updateFilter = (key: string, value: string) => {
  const next = new URLSearchParams(searchParams);
  if (value) next.set(key, value);
  else next.delete(key);
  setSearchParams(next, { replace: true });
 };

 return (
  <>
   <Box customClass="admin-page-head">
    <Text component="h1" customClass="admin-page-title">
     {problemsText}
    </Text>
    <Text customClass="admin-page-hint">{problemsHintText}</Text>
   </Box>

   {nowRequest.data && (
    <Card customClass="admin-detail">
     <Box customClass="admin-detail-head">
      <Box
       customClass={classNames("admin-stat-icon", isCheckStale && "danger")}
      >
       <RefreshCw05 size={18} aria-hidden />
      </Box>
      <Text component="h2" customClass="admin-section-title">
       {lastSpeedCheckText}
      </Text>
      <Text
       customClass={classNames("admin-detail-meta", isCheckStale && "danger")}
       title={lastCheck ? formatDateTime(lastCheck.created) : undefined}
      >
       {lastCheck ? formatTimeAgo(lastCheck.created) : notRunYetText}
      </Text>
     </Box>
     {lastCheck && (
      <Text customClass="admin-page-hint">
       {speedCheckSummaryText(
        formatUtcDateTime(lastCheck.checked_until),
        lastCheck.new_issues,
       )}
      </Text>
     )}
    </Card>
   )}

   <Box component="section" customClass="admin-section">
    <Box customClass="admin-toolbar">
     <CustomTabs
      customClass="admin-range"
      value={status}
      onChange={(_, value: string) => updateFilter("status", value)}
     >
      <CustomTab
       value={ADMIN_ISSUE_STATUS.OPEN}
       label={openCount === undefined ? openText : openCountText(openCount)}
      />
      <CustomTab value={ADMIN_ISSUE_STATUS.RESOLVED} label={resolvedText} />
     </CustomTabs>
     <CustomSelect
      customClass="admin-filter"
      value={type}
      options={ISSUE_TYPE_OPTIONS}
      placeholder={allTypesText}
      onChange={(value) => updateFilter("type", value)}
     />
    </Box>

    {list.error ? (
     <ErrorNotice message={list.error} />
    ) : (
     <Card customClass="admin-table">
      <Box customClass="admin-table-head">
       <Text customClass="admin-table-label">{problemText}</Text>
       <Text customClass="admin-table-label">{recordText}</Text>
       <Text customClass="admin-table-label">{detailsText}</Text>
       <Text customClass="admin-table-label">{foundText}</Text>
      </Box>
      {list.isLoading &&
       Array.from({ length: PROBLEMS_SKELETON_ROWS }, (_, index) => (
        <Box key={index} customClass="admin-table-skeleton">
         <Skeleton width="70%" />
         <Skeleton width="40%" />
        </Box>
       ))}
      {!list.isLoading && !list.items.length && (
       <Text customClass="admin-table-empty">
        {status === ADMIN_ISSUE_STATUS.OPEN
         ? noOpenProblemsText
         : noResolvedProblemsText}
       </Text>
      )}
      {list.items.map((issue) => (
       <Link
        key={issue.id}
        to={problemPath(issue.id)}
        className="admin-table-row"
       >
        <Text customClass="admin-cell-title">
         {ISSUE_TYPE_LABELS[issue.type] ?? issue.type}
        </Text>
        <Text customClass="admin-cell-id" title={issue.source_id}>
         {issue.source_id}
        </Text>
        <Text customClass="admin-cell-text">{issue.detail}</Text>
        <Text
         customClass="admin-cell-meta"
         title={formatDateTime(issue.created)}
        >
         {formatTimeAgo(issue.created)}
        </Text>
       </Link>
      ))}
     </Card>
    )}

    {list.hasMore && (
     <Button
      customClass="admin-btn secondary admin-load-more"
      isLoading={list.isLoadingMore}
      onClick={list.loadMore}
     >
      {loadMoreText}
     </Button>
    )}
   </Box>
  </>
 );
}
