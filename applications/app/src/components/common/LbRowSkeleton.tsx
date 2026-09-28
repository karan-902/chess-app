import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";

export default function LbRowSkeleton() {
 return (
  <Card customClass="lb-row">
   <Text customClass="lb-rank">
    <Skeleton customClass="text" />
   </Text>
   <Text customClass="lb-name row-title">
    <Skeleton customClass="text" width="45%" />
   </Text>
   <Text customClass="lb-earnings amount-value">
    <Skeleton customClass="text" width={56} />
   </Text>
  </Card>
 );
}
