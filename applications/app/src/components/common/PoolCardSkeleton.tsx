import Card from "@gopvp/common/src/components/Card/Card";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";

export default function PoolCardSkeleton() {
 return (
  <Card customClass="pool-card static">
   <Skeleton variant="rectangular" customClass="pool-art-skeleton" />
   <Skeleton variant="rectangular" customClass="pool-time-skeleton" />
   <Skeleton variant="rectangular" customClass="pool-win-skeleton" />
   <Skeleton variant="rectangular" customClass="pool-entry-skeleton" />
  </Card>
 );
}
