import { forwardRef } from "react";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import type { IStatTileProps } from "@gopvp/common/src/types/component";

export const StatTile = forwardRef<HTMLDivElement, IStatTileProps>(
 ({ label, value, customClass, valueClass }, ref) => (
  <Box ref={ref} customClass={classNames("stat-tile", customClass)}>
   <Text customClass="stat-tile-label" uppercase>
    {label}
   </Text>
   <Text customClass={classNames("stat-tile-value", valueClass)}>{value}</Text>
  </Box>
 ),
);

StatTile.displayName = "StatTile";

export default StatTile;
