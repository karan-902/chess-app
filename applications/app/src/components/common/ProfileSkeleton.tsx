import Box from "@gopvp/common/src/components/Box/Box";
import Card from "@gopvp/common/src/components/Card/Card";
import Text from "@gopvp/common/src/components/Text/Text";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
// import StatTile from "@gopvp/common/src/components/StatTile/StatTile";
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
    <Box customClass="profile-id-row">
     <Skeleton variant="circular" width={56} height={56} />
     <Box customClass="profile-id-text">
      <Text customClass="profile-id-name">
       <Skeleton customClass="text" width={110} />
      </Text>
      <Text customClass="profile-id-email">
       <Skeleton customClass="text" width={150} />
      </Text>
     </Box>
    </Box>
    {/* <Box customClass="profile-id-top">
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
    </Box> */}
    {/* <Box customClass="profile-stats-strip">
     {Array.from({ length: PROFILE_STAT_SKELETON_COUNT }, (_, index) => (
      <StatTile
       key={index}
       layout="compact"
       icon={
        <Skeleton variant="rectangular" customClass="profile-stat-icon-skeleton" />
       }
       label={<Skeleton customClass="text" width={56} />}
       value={<Skeleton customClass="text" width={40} />}
      />
     ))}
    </Box> */}
   </Card>

   <Card customClass="profile-stats-card">
    {Array.from({ length: PROFILE_STAT_SKELETON_COUNT }, (_, index) => (
     <Box key={index} customClass="profile-stat">
      <Text customClass="profile-stat-val">
       <Skeleton customClass="text" width={44} />
      </Text>
      <Text customClass="profile-stat-label">
       <Skeleton customClass="text" width={48} />
      </Text>
     </Box>
    ))}
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
