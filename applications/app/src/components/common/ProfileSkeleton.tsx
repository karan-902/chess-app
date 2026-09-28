import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import StatRowSkeleton from "@gopvp/app/src/components/common/StatRowSkeleton";
import { renderSkeletons } from "@gopvp/app/src/utils/skeleton";
import { PROFILE_ACCOUNT_SKELETON_ROWS } from "@gopvp/app/src/constants/limit";
import { accountText } from "@gopvp/app/src/constants/message";

export default function ProfileSkeleton() {
 return (
  <>
   <Card customClass="profile-id-card">
    <Box customClass="profile-hero">
     <Skeleton variant="circular" width={72} height={72} />
     <Box customClass="profile-name-row">
      <Text customClass="profile-id-name">
       <Skeleton customClass="text" width={100} />
      </Text>
      <Skeleton variant="rounded" width={20} height={15} />
     </Box>
    </Box>
   </Card>

   <Text component="h3" customClass="subsection-heading section-heading">
    {accountText}
   </Text>
   <Card customClass="stat-list">
    {renderSkeletons(PROFILE_ACCOUNT_SKELETON_ROWS, StatRowSkeleton)}
   </Card>
  </>
 );
}
