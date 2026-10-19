import { Fragment } from "react";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import CustomBadge from "@gopvp/common/src/components/Badge/Badge";
import StatTile from "@gopvp/common/src/components/StatTile/StatTile";
import { icons } from "@gopvp/common/src/components/images";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import { vsText } from "@gopvp/app/src/constants/message";
import type { IResultSheetProps } from "@gopvp/app/src/types/component";

export default function ResultSheet({
 open,
 onClose,
 tone,
 title,
 subtitle,
 amount,
 tiles,
 skeletonTiles,
 tileIcon,
 versus = false,
 hideGlow = false,
 children,
}: IResultSheetProps) {
 const {
  gameModule: { logoSrc },
 } = useGame();
 const TileIcon = tileIcon && icons[tileIcon];
 const isLoading = !tiles;

 return (
  <CustomDrawer
   anchor="bottom"
   open={open}
   onClose={onClose}
   customClass={classNames(
    "result-sheet",
    tone,
    versus && "versus",
    hideGlow && "no-glow",
   )}
  >
   <Box customClass="result-hero">
    {isLoading ? (
     <Skeleton variant="rounded" customClass="result-logo-skeleton" />
    ) : (
     <img src={logoSrc} alt="" />
    )}
    <Text customClass="result-title">
     {isLoading ? <Skeleton customClass="text" width={140} /> : title}
    </Text>
    {subtitle !== undefined && (
     <Text customClass="result-subtitle">
      {isLoading ? <Skeleton customClass="text" width={140} /> : subtitle}
     </Text>
    )}
    <Text customClass="result-amount">
     {isLoading ? <Skeleton customClass="text" width={120} /> : amount}
    </Text>
   </Box>

   <Box customClass={classNames("result-tiles", versus && "versus")}>
    {(tiles ?? Array.from({ length: skeletonTiles }, () => null)).map(
     (tile, index) => (
      <Fragment key={tile?.label ?? index}>
       {versus &&
        index > 0 &&
        (isLoading ? (
         <Skeleton variant="circular" customClass="result-vs-skeleton" />
        ) : (
         <CustomBadge customClass="result-vs" badgeContent={vsText} />
        ))}
       <StatTile
        layout="label-top"
        label={tile ? tile.label : <Skeleton customClass="text" width={60} />}
        value={tile ? tile.value : <Skeleton customClass="text" width={50} />}
        icon={tile && (tile.icon ? <tile.icon /> : TileIcon && <TileIcon />)}
        customClass={classNames(tile?.highlight && "highlight")}
       />
      </Fragment>
     ),
    )}
   </Box>

   {children}
  </CustomDrawer>
 );
}
