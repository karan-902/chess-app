import Card from "@gopvp/common/src/components/Card/Card";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";

export default function PoolCardSkeleton() {
 return (
  <Card customClass="bet-card">
   <Box customClass="pool-meta">
    <Text component="span" customClass="description">
     <Skeleton customClass="text" width={90} />
    </Text>
   </Box>
   <Text customClass="bet-card-tc">
    <Skeleton customClass="text" width={40} />
   </Text>
   <Text customClass="pool-win-amt">
    <Skeleton customClass="text" width={60} />
   </Text>
   <Text customClass="pool-entry-fee">
    <Skeleton customClass="text" width={70} />
   </Text>
   <Skeleton variant="rounded" customClass="pool-play-skeleton" />
  </Card>
 );
}
