import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import type { IStatListProps } from "@gopvp/app/src/types/component";

export default function StatList({
 rows,
 skeletonRows,
 customClass,
}: IStatListProps) {
 return (
  <Box customClass={classNames("stat-grid", customClass)}>
   {(rows ?? Array.from({ length: skeletonRows }, () => null)).map(
    (row, index) => (
     <Card key={row?.label ?? index} customClass="stat-card">
      <Box customClass={classNames("stat-card-icon", row?.tone)}>
       {row?.icon && <row.icon strokeWidth={2} />}
      </Box>
      <Text component="span" customClass="stat-card-label">
       {row ? row.label : <Skeleton customClass="text" width={80} />}
      </Text>
      <Text
       component="span"
       customClass={classNames("stat-card-val", row?.isPrize && "prize")}
      >
       {row ? row.value : <Skeleton customClass="text" width={60} />}
      </Text>
     </Card>
    ),
   )}
  </Box>
 );
}
