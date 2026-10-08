import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";

export default function TxItemSkeleton() {
 return (
  <Box customClass="wallet-tx-item loading">
   <Box customClass="wallet-tx-row">
    <Box customClass="wallet-tx-info">
     <Box customClass="wallet-tx-icon">
      <Skeleton variant="rounded" customClass="tx-icon-skeleton" />
     </Box>
     <Box customClass="wallet-tx-text">
      <Text customClass="row-title">
       <Skeleton customClass="text" width={70} />
      </Text>
      <Text customClass="meta-text">
       <Skeleton customClass="text" width={48} />
      </Text>
     </Box>
    </Box>
    <Text component="span" customClass="amount-value">
     <Skeleton customClass="text" width={56} />
    </Text>
   </Box>
  </Box>
 );
}
