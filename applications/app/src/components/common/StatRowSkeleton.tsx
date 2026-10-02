import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";

export default function StatRowSkeleton() {
 return (
  <Box customClass="stat-row">
   <Text component="span" customClass="stat-title">
    <Skeleton customClass="text" width={100} />
   </Text>
   <Text component="span" customClass="stat-val">
    <Skeleton customClass="text" width={40} />
   </Text>
  </Box>
 );
}
