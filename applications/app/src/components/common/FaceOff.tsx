import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomAvatar from "@gopvp/common/src/components/Avatar/Avatar";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import { icons } from "@gopvp/common/src/components/images";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import { shortenUsername } from "@gopvp/common/src/util/format";
import { youText } from "@gopvp/common/src/constants/message";
import { vsText } from "@gopvp/app/src/constants/message";
import type { IFaceOffProps } from "@gopvp/app/src/types/component";

export default function FaceOff({ opponentName }: IFaceOffProps) {
 const username = useReduxSelector(
  (state) => state.auth.session?.username ?? "",
 );

 return (
  <Box customClass="face-off">
   <Box customClass="face-off-card">
    <CustomAvatar
     letter={username.charAt(0).toUpperCase()}
     customClass="face-off"
    />
    <Box customClass="face-off-info">
     <Text customClass="face-off-name">{youText}</Text>
     <Text customClass="face-off-username">{shortenUsername(username)}</Text>
    </Box>
   </Box>
   <Text customClass="face-off-vs">{vsText}</Text>
   <Box customClass="face-off-card rival">
    {opponentName ? (
     <>
      <CustomAvatar
       letter={opponentName.charAt(0).toUpperCase()}
       customClass="face-off"
      />
      <Box customClass="face-off-info">
       <Text customClass="face-off-name">{shortenUsername(opponentName)}</Text>
      </Box>
     </>
    ) : (
     <>
      <Box customClass="face-off-searching">
       <icons.userRound />
      </Box>
      <Box customClass="face-off-info">
       <Skeleton variant="rounded" customClass="face-off-bar" />
       <Skeleton variant="rounded" customClass="face-off-bar sub" />
      </Box>
     </>
    )}
   </Box>
  </Box>
 );
}
