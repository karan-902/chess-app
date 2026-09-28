import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import StatRowSkeleton from "@gopvp/app/src/components/common/StatRowSkeleton";
import { renderSkeletons } from "@gopvp/app/src/utils/skeleton";
import type { IStatListProps } from "@gopvp/app/src/types/component";

export default function StatList({ rows, skeletonRows }: IStatListProps) {
 return (
  <Card customClass="stat-list">
   {rows
    ? rows.map(({ label, value }) => (
       <Box key={label} customClass="stat-row">
        <Text component="span" customClass="stat-title">
         {label}
        </Text>
        <Text component="span" customClass="stat-val">
         {value}
        </Text>
       </Box>
      ))
    : renderSkeletons(skeletonRows, StatRowSkeleton)}
  </Card>
 );
}
