import Card from "@gopvp/common/src/components/Card/Card";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";

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
    <Box customClass="pool-stat">
     <Text customClass="stake-label">
      <Skeleton customClass="text" width={24} />
     </Text>
     <Text customClass="stake-value">
      <Skeleton customClass="text" width={60} />
     </Text>
    </Box>
   </Box>
   <Skeleton variant="rounded" customClass="pool-play-skeleton" />
  </Card>
 );
}
