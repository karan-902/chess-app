import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";

export default function StatRowSkeleton() {
 return (
  <Box customClass="stat-row">
   <Box customClass="profile-row-label">
    <Skeleton variant="rectangular" customClass="profile-row-icon-skeleton" />
    <Text component="span" customClass="stat-title">
     <Skeleton customClass="text" width={56} />
    </Text>
   </Box>
   <Text component="span" customClass="stat-val">
    <Skeleton customClass="text" width={120} />
   </Text>
  </Box>
 );
}
