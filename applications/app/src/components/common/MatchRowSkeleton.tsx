import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";

export default function MatchRowSkeleton() {
 return (
  <Box customClass="match-row-item">
   <Box customClass="match-row">
    <Box customClass="match-row-info">
     <Box customClass="match-row-text">
      <Text customClass="match-row-headline row-title">
       <Skeleton customClass="text" width={140} />
      </Text>
     </Box>
    </Box>
    <Box customClass="match-row-amt-wrap">
     <Text component="span" customClass="amount-value">
      <Skeleton customClass="text" width={48} />
     </Text>
    </Box>
   </Box>
  </Box>
 );
}
