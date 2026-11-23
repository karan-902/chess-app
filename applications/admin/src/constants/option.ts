import {
 AlertTriangle,
 ArrowCircleDown,
 ArrowCircleUp,
 File04,
 LayoutAlt01,
 Scales02,
 ShieldTick,
 Trophy01,
 User01,
 Users01,
} from "@gopvp/common/src/components/images";
import { ROUTES } from "@gopvp/admin/src/constants/route";
import {
 ADMIN_LEDGER_BALANCE,
 ADMIN_LEDGER_DIRECTION,
} from "@gopvp/admin/src/constants/endpoint";
import { ISSUE_TYPE_LABELS } from "@gopvp/admin/src/constants/label";
import { ADMIN_MONEY_ROLES } from "@gopvp/admin/src/constants/mapper";
import {
 addText,
 adminsText,
 allTypesText,
 approvalsText,
 auditLogText,
 dashboardText,
 depositsText,
 ledgerText,
 matchesText,
 moneyText,
 overviewText,
 platformText,
 playableText,
 problemsText,
 sevenDaysText,
 takeText,
 thirtyDaysText,
 todayText,
 usersText,
 withdrawableText,
 withdrawsText,
} from "@gopvp/admin/src/constants/message";
import type {
 TAdminMoneyRange,
 TAdminNavSection,
 TAdminOption,
} from "@gopvp/admin/src/types";

export const ADMIN_NAV_SECTIONS: TAdminNavSection[] = [
 {
  title: overviewText,
  items: [
   { label: dashboardText, icon: LayoutAlt01, path: ROUTES.DASHBOARD },
   {
    label: problemsText,
    icon: AlertTriangle,
    path: ROUTES.PROBLEMS,
    roles: ADMIN_MONEY_ROLES,
   },
   { label: approvalsText, icon: ShieldTick },
  ],
 },
 {
  title: moneyText,
  items: [
   { label: withdrawsText, icon: ArrowCircleUp },
   { label: depositsText, icon: ArrowCircleDown },
   { label: ledgerText, icon: Scales02 },
  ],
 },
 {
  title: platformText,
  items: [
   { label: usersText, icon: Users01 },
   { label: matchesText, icon: Trophy01 },
   { label: adminsText, icon: User01 },
   { label: auditLogText, icon: File04 },
  ],
 },
];

export const DASHBOARD_MONEY_RANGES: TAdminMoneyRange[] = [
 { label: todayText, days: 0 },
 { label: sevenDaysText, days: 7 },
 { label: thirtyDaysText, days: 30 },
];

export const ISSUE_TYPE_OPTIONS: TAdminOption[] = [
 { value: "", label: allTypesText },
 ...Object.entries(ISSUE_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
 })),
];

export const ADJUST_DIRECTION_OPTIONS: TAdminOption[] = [
 { value: ADMIN_LEDGER_DIRECTION.CREDIT, label: addText },
 { value: ADMIN_LEDGER_DIRECTION.DEBIT, label: takeText },
];

export const ADJUST_BALANCE_OPTIONS: TAdminOption[] = [
 { value: ADMIN_LEDGER_BALANCE.PLAYABLE, label: playableText },
 { value: ADMIN_LEDGER_BALANCE.WITHDRAWABLE, label: withdrawableText },
];
