import {
 CallMadeIcon,
 CallReceivedIcon,
 CircleAlert,
 FileText,
 LayoutDashboard,
 Scale,
 ShieldCheck,
 Trophy,
 User,
 Users,
} from "@gopvp/common/src/components/images";
import { ROUTES } from "@gopvp/admin/src/constants/route";
import {
 adminsText,
 approvalsText,
 auditLogText,
 dashboardText,
 depositsText,
 ledgerText,
 matchesText,
 moneyText,
 overviewText,
 platformText,
 problemsText,
 usersText,
 withdrawsText,
} from "@gopvp/admin/src/constants/message";
import type { TAdminNavSection } from "@gopvp/admin/src/types";

export const ADMIN_NAV_SECTIONS: TAdminNavSection[] = [
 {
  title: overviewText,
  items: [
   { label: dashboardText, icon: LayoutDashboard, path: ROUTES.DASHBOARD },
   { label: problemsText, icon: CircleAlert },
   { label: approvalsText, icon: ShieldCheck },
  ],
 },
 {
  title: moneyText,
  items: [
   { label: withdrawsText, icon: CallMadeIcon },
   { label: depositsText, icon: CallReceivedIcon },
   { label: ledgerText, icon: Scale },
  ],
 },
 {
  title: platformText,
  items: [
   { label: usersText, icon: Users },
   { label: matchesText, icon: Trophy },
   { label: adminsText, icon: User },
   { label: auditLogText, icon: FileText },
  ],
 },
];
