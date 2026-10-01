import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import StatRowSkeleton from "@gopvp/app/src/components/common/StatRowSkeleton";
import { renderSkeletons } from "@gopvp/app/src/utils/skeleton";
import type { IStatListProps } from "@gopvp/app/src/types/component";

export default function StatList({
 rows,
 skeletonRows,
 customClass,
}: IStatListProps) {
 return (
  <Card customClass={classNames("stat-list", customClass)}>
   {rows
    ? rows.map(({ label, value, icon: Icon, tone }) => (
       <Box key={label} customClass="stat-row">
        <Box customClass="stat-label">
         {Icon && (
          <Icon className={classNames("stat-icon", tone)} strokeWidth={2} />
         )}
         <Text component="span" customClass="stat-title">
          {label}
         </Text>
        </Box>
        <Text component="span" customClass="stat-val">
         {value}
        </Text>
       </Box>
      ))
    : renderSkeletons(skeletonRows, StatRowSkeleton)}
  </Card>
 );
}
