import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import StatRowSkeleton from "@gopvp/app/src/components/common/StatRowSkeleton";
import { renderSkeletons } from "@gopvp/app/src/utils/skeleton";
import {
 PROFILE_ACCOUNT_SKELETON_ROWS,
 PROFILE_STAT_SKELETON_COUNT,
} from "@gopvp/app/src/constants/limit";
import { accountText } from "@gopvp/app/src/constants/message";

export default function ProfileSkeleton() {
 return (
  <>
   <Card customClass="profile-id-card">
    <Box customClass="profile-id-top">
     <Skeleton variant="rectangular" customClass="profile-edit-skeleton" />
    </Box>
    <Box customClass="profile-hero">
     <Box customClass="profile-avatar-wrap">
      <Skeleton variant="circular" customClass="profile-avatar-skeleton" />
     </Box>
     <Box customClass="profile-name-row">
      <Text customClass="profile-id-name">
       <Skeleton customClass="text" width={110} />
      </Text>
      <Skeleton variant="rectangular" customClass="profile-flag-skeleton" />
     </Box>
    </Box>
    <Box customClass="profile-stats-strip">
     {Array.from({ length: PROFILE_STAT_SKELETON_COUNT }, (_, index) => (
      <Box key={index} customClass="profile-stat">
       <Skeleton variant="rectangular" customClass="profile-stat-icon-skeleton" />
       <Text customClass="profile-stat-val">
        <Skeleton customClass="text" width={40} />
       </Text>
       <Text customClass="profile-stat-lbl">
        <Skeleton customClass="text" width={56} />
       </Text>
      </Box>
     ))}
    </Box>
   </Card>

   <Text
    component="h3"
    customClass="subsection-heading profile-section-heading"
   >
    {accountText}
   </Text>
   <Card customClass="stat-list profile-list">
    {renderSkeletons(PROFILE_ACCOUNT_SKELETON_ROWS, StatRowSkeleton)}
   </Card>
  </>
 );
}
