import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import StatTile from "@gopvp/common/src/components/StatTile/StatTile";
import type { IStatListProps } from "@gopvp/app/src/types/component";

export default function StatList({
 rows,
 skeletonRows,
 customClass,
}: IStatListProps) {
 return (
  <Box customClass={classNames("result-tiles", customClass)}>
   {(rows ?? Array.from({ length: skeletonRows }, () => null)).map(
    (row, index) => (
     <StatTile
      key={row?.label ?? index}
      layout="label-top"
      icon={row?.icon && <row.icon />}
      label={row ? row.label : <Skeleton customClass="text" width={80} />}
      value={row ? row.value : <Skeleton customClass="text" width={60} />}
      valueClass={classNames(row?.isPrize && "prize")}
     />
    ),
   )}
  </Box>
 );
}
