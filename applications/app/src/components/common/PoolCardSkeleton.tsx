import Card from "@gopvp/common/src/components/Card/Card";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import StatTile from "@gopvp/common/src/components/StatTile/StatTile";

export default function PoolCardSkeleton() {
 return (
  <Card customClass="bet-card">
   <Box customClass="pool-meta">
    <Box customClass="pool-mode">
     <Skeleton variant="rounded" customClass="pool-mode-icon" />
     <Text component="span" customClass="pool-mode-name">
      <Skeleton customClass="text" width={50} />
     </Text>
    </Box>
   </Box>
   <Box customClass="pool-stats">
    <StatTile
     layout="stake"
     label={<Skeleton customClass="text" width={24} />}
     value={<Skeleton customClass="text" width={60} />}
    />
    <StatTile
     layout="stake"
     customClass="entry"
     label={<Skeleton customClass="text" width={32} />}
     value={<Skeleton customClass="text" width={40} />}
    />
   </Box>
   <Skeleton variant="rounded" customClass="pool-play-skeleton" />
  </Card>
 );
}
