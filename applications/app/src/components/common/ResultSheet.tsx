import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import { icons } from "@gopvp/common/src/components/images";
import { useGame } from "@gopvp/app/src/hooks/useGame";
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
 children,
 customClass,
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
   customClass={classNames("result-sheet", tone, customClass)}
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
    <Text customClass="result-subtitle">
     {isLoading ? <Skeleton customClass="text" width={140} /> : subtitle}
    </Text>
    <Text customClass="result-amount">
     {isLoading ? <Skeleton customClass="text" width={120} /> : amount}
    </Text>
   </Box>

   <Box customClass="result-tiles">
    {(tiles ?? Array.from({ length: skeletonTiles }, () => null)).map(
     (tile, index) => (
      <Box key={tile?.label ?? index} customClass="result-tile-wrap">
       <Box customClass="result-tile-label">
        <Text component="span" customClass="result-tile-lbl">
         {tile ? tile.label : <Skeleton customClass="text" width={60} />}
        </Text>
        {tile && TileIcon && <TileIcon />}
       </Box>
       <Box customClass="result-tile">
        <Text customClass="result-tile-val">
         {tile ? tile.value : <Skeleton customClass="text" width={50} />}
        </Text>
       </Box>
      </Box>
     ),
    )}
   </Box>

   {children}
  </CustomDrawer>
 );
}
