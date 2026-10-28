import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomChip from "@gopvp/common/src/components/Chip/Chip";
import {
 apiPendingHintText,
 apiPendingText,
 devDataText,
 needsAttentionText,
 platformEarningsText,
 platformOverviewHintText,
 platformOverviewText,
 realMarginText,
 recentWithdrawsText,
 speedFeesPaidText,
 usersMoneyText,
 whereMoneyIsText,
} from "@gopvp/admin/src/constants/message";

const KPI_LABELS = [
 platformEarningsText,
 speedFeesPaidText,
 realMarginText,
 usersMoneyText,
];

const PANEL_TITLES = [needsAttentionText, whereMoneyIsText, recentWithdrawsText];

export default function Dashboard() {
 return (
  <>
   <Box customClass="admin-page-head">
    <Box>
     <Text component="h1" customClass="admin-page-title">
      {platformOverviewText}
     </Text>
     <Text customClass="color-muted">{platformOverviewHintText}</Text>
    </Box>
    <CustomChip label={devDataText} customClass="admin-status amber" />
   </Box>

   <Box component="section" customClass="admin-kpis">
    {KPI_LABELS.map((label) => (
     <Card key={label} customClass="admin-panel">
      <Text customClass="color-muted">{label}</Text>
      <Text customClass="admin-kpi-value">—</Text>
      <CustomChip label={apiPendingText} customClass="admin-status" />
     </Card>
    ))}
   </Box>

   {PANEL_TITLES.map((title) => (
    <Card key={title} component="section" customClass="admin-panel">
     <Text component="h2" customClass="admin-panel-title">
      {title}
     </Text>
     <Box customClass="admin-placeholder">{apiPendingHintText}</Box>
    </Card>
   ))}
  </>
 );
}
