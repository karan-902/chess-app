import { useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import dayjs from "dayjs";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import CustomChip from "@gopvp/common/src/components/Chip/Chip";
import { CustomTab, CustomTabs } from "@gopvp/common/src/components/Tabs/Tabs";
import {
 Activity,
 AlertTriangle,
 ArrowCircleDown,
 ArrowCircleUp,
 Bank,
 CoinsStacked01,
 Hourglass01,
 Receipt,
 RefreshCw05,
 TrendUp01,
 Users01,
 Wallet02,
} from "@gopvp/common/src/components/images";
import {
 formatAmount,
 formatDateTime,
 formatNumber,
 formatTimeAgo,
 formatUtcDateTime,
} from "@gopvp/common/src/util/format";
import {
 ADMIN_ENDPOINTS,
 ADMIN_TRANSFER_STATUS,
} from "@gopvp/admin/src/constants/endpoint";
import { SPEED_CHECK_TYPE_LABELS } from "@gopvp/admin/src/constants/label";
import {
 DASHBOARD_NOW_SKELETON_TILES,
 DASHBOARD_RECENT_LIMIT,
 DASHBOARD_TOTAL_SKELETON_CELLS,
} from "@gopvp/admin/src/constants/limit";
import { ADMIN_MONEY_ROLES } from "@gopvp/admin/src/constants/mapper";
import { DASHBOARD_MONEY_RANGES } from "@gopvp/admin/src/constants/option";
import { ROUTES } from "@gopvp/admin/src/constants/route";
import {
 checkedFromText,
 checkedUntilText,
 dashboardHintText,
 dashboardText,
 depositsInReviewText,
 fundsCheckText,
 fundsOkText,
 fundsShortText,
 lastSpeedCheckText,
 liveMatchesText,
 livePlayersText,
 moneyInAmountText,
 moneyInText,
 moneyOutAmountText,
 moneyOutText,
 newProblemsText,
 noDataText,
 notRunYetText,
 openProblemsText,
 playersMoneyText,
 recentMoneyInText,
 recentMoneyOutText,
 rightNowText,
 stuckMatchesText,
 stuckWithdrawsText,
 totalFeesKeptText,
 totalProfitTakenOutText,
 totalProfitText,
 totalSpeedFeesText,
 transactionsCheckedText,
 utcDateTimeText,
} from "@gopvp/admin/src/constants/message";
import { useAdminGet } from "@gopvp/admin/src/hooks/useAdminGet";
import { loadAdminSession } from "@gopvp/admin/src/utils/session";
import { isSpeedCheckStale } from "@gopvp/admin/src/utils/status";
import ErrorNotice from "@gopvp/admin/src/components/ErrorNotice";
import FieldList from "@gopvp/admin/src/components/FieldList";
import type {
 TAdminDashboardMoney,
 TAdminDashboardNow,
 TAdminDepositRow,
 TAdminField,
 TAdminList,
 TAdminStatCard,
 TAdminWithdrawRow,
} from "@gopvp/admin/src/types";

const RECENT_DEPOSITS_PATH = `${ADMIN_ENDPOINTS.DEPOSITS}?status=${ADMIN_TRANSFER_STATUS.COMPLETED}&limit=${DASHBOARD_RECENT_LIMIT}`;
const RECENT_WITHDRAWS_PATH = `${ADMIN_ENDPOINTS.WITHDRAWS}?status=${ADMIN_TRANSFER_STATUS.COMPLETED}&limit=${DASHBOARD_RECENT_LIMIT}`;

const buildMoneyPath = (days?: number) => {
 const startOfToday = dayjs().startOf("day");
 const from =
  days === undefined ? 0 : startOfToday.subtract(days, "day").valueOf();
 return `${ADMIN_ENDPOINTS.DASHBOARD_MONEY}?from=${from}&to=${startOfToday.add(1, "day").valueOf()}`;
};

const renderStatTiles = (
 cards: TAdminStatCard[],
 navigate?: NavigateFunction,
) =>
 cards.map(({ label, icon: Icon, value, hint, tone, path }) => (
  <Card
   key={label}
   customClass="admin-stat"
   onClick={path && navigate ? () => navigate(path) : undefined}
  >
   <Box customClass="admin-stat-head">
    <Box customClass={classNames("admin-stat-icon", tone)}>
     <Icon size={18} aria-hidden />
    </Box>
    <Text customClass="admin-stat-label">{label}</Text>
   </Box>
   <Text customClass={classNames("admin-stat-value", tone)}>{value}</Text>
   {hint && <Text customClass="admin-stat-hint">{hint}</Text>}
  </Card>
 ));

const renderSkeletonTiles = (count: number) =>
 Array.from({ length: count }, (_, index) => (
  <Card key={index} customClass="admin-stat">
   <Box customClass="admin-stat-head">
    <Box customClass="admin-stat-icon" />
    <Text customClass="admin-stat-label">
     <Skeleton width="50%" />
    </Text>
   </Box>
   <Text customClass="admin-stat-value">
    <Skeleton width="40%" />
   </Text>
  </Card>
 ));

const renderTotalCells = (cards: TAdminStatCard[], isLoading: boolean) =>
 isLoading
  ? Array.from({ length: DASHBOARD_TOTAL_SKELETON_CELLS }, (_, index) => (
     <Box key={index} customClass="admin-strip-cell">
      <Box customClass="admin-strip-icon" />
      <Skeleton width="60%" />
      <Skeleton width="40%" />
     </Box>
    ))
  : cards.map(({ label, icon: Icon, value }) => (
     <Box key={label} customClass="admin-strip-cell">
      <Box customClass="admin-strip-icon">
       <Icon size={20} aria-hidden />
      </Box>
      <Text customClass="admin-strip-label">{label}</Text>
      <Text customClass="admin-stat-value">{value}</Text>
     </Box>
    ));

const renderRecentRows = (
 recent: {
  data: TAdminList<TAdminDepositRow | TAdminWithdrawRow> | null;
  error: string;
  isLoading: boolean;
 },
 signAmount: (amount: string) => string,
) => {
 if (recent.error) return <ErrorNotice message={recent.error} />;
 if (recent.isLoading)
  return Array.from({ length: DASHBOARD_RECENT_LIMIT }, (_, index) => (
   <Box key={index} customClass="admin-recent-row">
    <Skeleton width="40%" />
    <Skeleton width="20%" />
   </Box>
  ));
 const rows = recent.data?.data ?? [];
 if (!rows.length)
  return <Text customClass="admin-recent-empty">{noDataText}</Text>;
 return rows.map(({ id, username, amount, created }) => (
  <Box key={id} customClass="admin-recent-row">
   <Box customClass="admin-recent-side">
    <Text customClass="admin-recent-name">{username}</Text>
    <Text customClass="admin-recent-meta" title={id}>
     {id}
    </Text>
   </Box>
   <Box customClass="admin-recent-side end">
    <Text customClass="admin-recent-name">
     {signAmount(formatAmount(amount))}
    </Text>
    <Text customClass="admin-recent-meta" title={formatDateTime(created)}>
     {formatTimeAgo(created)}
    </Text>
   </Box>
  </Box>
 ));
};

export default function Dashboard() {
 const navigate = useNavigate();
 const session = loadAdminSession();
 const canSeeMoney = !!session && ADMIN_MONEY_ROLES.has(session.role);
 const [inRangeDays, setInRangeDays] = useState(DASHBOARD_MONEY_RANGES[0].days);
 const [outRangeDays, setOutRangeDays] = useState(
  DASHBOARD_MONEY_RANGES[0].days,
 );

 const nowRequest = useAdminGet<TAdminDashboardNow>(
  ADMIN_ENDPOINTS.DASHBOARD_NOW,
 );
 const totals = useAdminGet<TAdminDashboardMoney>(
  canSeeMoney ? buildMoneyPath() : null,
 );
 const moneyIn = useAdminGet<TAdminDashboardMoney>(
  canSeeMoney ? buildMoneyPath(inRangeDays) : null,
 );
 const moneyOut = useAdminGet<TAdminDashboardMoney>(
  canSeeMoney ? buildMoneyPath(outRangeDays) : null,
 );
 const recentIn = useAdminGet<TAdminList<TAdminDepositRow>>(
  canSeeMoney ? RECENT_DEPOSITS_PATH : null,
 );
 const recentOut = useAdminGet<TAdminList<TAdminWithdrawRow>>(
  canSeeMoney ? RECENT_WITHDRAWS_PATH : null,
 );

 const now = nowRequest.data;
 const nowCards: TAdminStatCard[] = now
  ? [
     {
      label: liveMatchesText,
      icon: Activity,
      value: formatNumber(now.live_matches),
     },
     {
      label: livePlayersText,
      icon: Users01,
      value: formatNumber(now.live_players),
     },
     {
      label: stuckMatchesText,
      icon: Hourglass01,
      value: formatNumber(now.stuck_matches),
      tone: now.stuck_matches > 0 ? "danger" : undefined,
     },
     {
      label: openProblemsText,
      icon: AlertTriangle,
      value: formatNumber(now.open_problems),
      tone: now.open_problems > 0 ? "warning" : undefined,
      path: canSeeMoney ? ROUTES.PROBLEMS : undefined,
     },
     {
      label: depositsInReviewText,
      icon: ArrowCircleDown,
      value: formatNumber(now.review_deposits),
      tone: now.review_deposits > 0 ? "warning" : undefined,
     },
     {
      label: stuckWithdrawsText,
      icon: ArrowCircleUp,
      value: formatNumber(now.stuck_withdraws),
      tone: now.stuck_withdraws > 0 ? "danger" : undefined,
     },
    ]
  : [];

 const lastCheck = now?.last_check;
 const isCheckStale = isSpeedCheckStale(lastCheck);
 const checkFields: TAdminField[] = [
  ...(lastCheck
   ? [
      {
       label: checkedFromText,
       value: utcDateTimeText(formatUtcDateTime(lastCheck.checked_from)),
      },
      {
       label: checkedUntilText,
       value: utcDateTimeText(formatUtcDateTime(lastCheck.checked_until)),
      },
      {
       label: transactionsCheckedText,
       value: formatNumber(lastCheck.transactions),
      },
      {
       label: newProblemsText,
       value: formatNumber(lastCheck.new_issues),
       tone: lastCheck.new_issues > 0 ? ("warning" as const) : undefined,
      },
     ]
   : []),
  {
   label: fundsCheckText,
   value: now?.funds_short ? fundsShortText : fundsOkText,
   tone: now?.funds_short ? "danger" : "success",
  },
 ];

 const totalCards: TAdminStatCard[] = totals.data
  ? [
     {
      label: totalProfitText,
      icon: TrendUp01,
      value: formatAmount(totals.data.profit),
     },
     {
      label: totalFeesKeptText,
      icon: CoinsStacked01,
      value: formatAmount(totals.data.fees_kept),
     },
     {
      label: totalSpeedFeesText,
      icon: Receipt,
      value: formatAmount(totals.data.speed_fees),
     },
     {
      label: totalProfitTakenOutText,
      icon: Bank,
      value: formatAmount(totals.data.profit_taken_out),
     },
    ]
  : [];

 const flowPanels = [
  {
   title: moneyInText,
   recentTitle: recentMoneyInText,
   rangeDays: inRangeDays,
   onRangeChange: setInRangeDays,
   money: moneyIn,
   total: moneyIn.data?.deposits_in,
   signAmount: moneyInAmountText,
   recent: recentIn,
  },
  {
   title: moneyOutText,
   recentTitle: recentMoneyOutText,
   rangeDays: outRangeDays,
   onRangeChange: setOutRangeDays,
   money: moneyOut,
   total: moneyOut.data?.withdraws_out,
   signAmount: moneyOutAmountText,
   recent: recentOut,
  },
 ];

 return (
  <>
   <Box customClass="admin-page-head">
    <Text component="h1" customClass="admin-page-title">
     {dashboardText}
    </Text>
    <Text customClass="admin-page-hint">{dashboardHintText}</Text>
   </Box>

   {canSeeMoney && (
    <Box component="section" customClass="admin-section">
     {totals.error ? (
      <ErrorNotice message={totals.error} />
     ) : (
      <Box customClass="admin-totals">
       <Card customClass="admin-hero">
        <Box customClass="admin-hero-icon">
         <Wallet02 size={22} aria-hidden />
        </Box>
        <Text customClass="admin-stat-label">{playersMoneyText}</Text>
        <Text customClass="admin-hero-value">
         {totals.data ? (
          formatAmount(totals.data.players_money)
         ) : (
          <Skeleton width="60%" />
         )}
        </Text>
        <Text customClass="admin-stat-hint">{rightNowText}</Text>
       </Card>
       <Card customClass="admin-strip">
        {renderTotalCells(totalCards, totals.isLoading)}
       </Card>
      </Box>
     )}

     <Box customClass="admin-flows">
      {flowPanels.map(
       ({
        title,
        recentTitle,
        rangeDays,
        onRangeChange,
        money,
        total,
        signAmount,
        recent,
       }) => (
        <Card key={title} customClass="admin-flow">
         <Box customClass="admin-flow-head">
          <Text component="h2" customClass="admin-section-title">
           {title}
          </Text>
          <Text customClass="admin-flow-total">
           {money.isLoading ? (
            <Skeleton width={72} />
           ) : (
            total !== undefined && signAmount(formatAmount(total))
           )}
          </Text>
         </Box>
         {money.error && <ErrorNotice message={money.error} />}
         <CustomTabs
          customClass="admin-range"
          value={rangeDays}
          onChange={(_, days: number) => onRangeChange(days)}
         >
          {DASHBOARD_MONEY_RANGES.map(({ label, days }) => (
           <CustomTab key={days} value={days} label={label} />
          ))}
         </CustomTabs>
         <Box customClass="admin-recent">
          <Text customClass="admin-stat-label">{recentTitle}</Text>
          {renderRecentRows(recent, signAmount)}
         </Box>
        </Card>
       ),
      )}
     </Box>
    </Box>
   )}

   <Box component="section" customClass="admin-section">
    <Text component="h2" customClass="admin-section-title">
     {rightNowText}
    </Text>
    {nowRequest.error ? (
     <ErrorNotice message={nowRequest.error} />
    ) : (
     <>
      <Box customClass="admin-stats three-col">
       {nowRequest.isLoading
        ? renderSkeletonTiles(DASHBOARD_NOW_SKELETON_TILES)
        : renderStatTiles(nowCards, navigate)}
      </Box>
      <Card customClass="admin-detail">
       <Box customClass="admin-detail-head">
        <Box
         customClass={classNames(
          "admin-stat-icon",
          !nowRequest.isLoading && isCheckStale && "danger",
         )}
        >
         <RefreshCw05 size={18} aria-hidden />
        </Box>
        <Text component="h3" customClass="admin-section-title">
         {lastSpeedCheckText}
        </Text>
        {lastCheck && (
         <CustomChip
          label={SPEED_CHECK_TYPE_LABELS[lastCheck.type] ?? lastCheck.type}
          customClass="admin-status"
         />
        )}
        {!nowRequest.isLoading && (
         <Text
          customClass={classNames(
           "admin-detail-meta",
           isCheckStale && "danger",
          )}
          title={lastCheck ? formatDateTime(lastCheck.created) : undefined}
         >
          {lastCheck ? formatTimeAgo(lastCheck.created) : notRunYetText}
         </Text>
        )}
       </Box>
       {nowRequest.isLoading ? (
        <Skeleton width="70%" />
       ) : (
        <FieldList fields={checkFields} />
       )}
      </Card>
     </>
    )}
   </Box>
  </>
 );
}
