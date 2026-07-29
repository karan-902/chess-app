import Box from "@/components/base/Box/Box";
import Skeleton from "@/components/base/Skeleton/Skeleton";

export default function ProfileSkeleton() {
    return (
        <>
            <Box customClass="profile-id-strip">
                <Skeleton variant="circle" width={56} height={56} />
                <Box customClass="profile-avatar-info">
                    <Skeleton variant="text" width="60%" height={16} />
                    <Skeleton variant="text" width="35%" height={12} />
                </Box>
                <Skeleton variant="rounded" width={64} height={30} />
            </Box>

            <Box customClass="profile-dashboard-grid">
                <Box customClass="profile-widget">
                    <Skeleton variant="text" width="40%" height={10} />
                    <Skeleton variant="text" width="60%" height={22} />
                </Box>
                <Box customClass="profile-widget">
                    <Skeleton variant="text" width="40%" height={10} />
                    <Skeleton variant="text" width="80%" height={10} />
                    <Skeleton variant="text" width="80%" height={10} />
                </Box>

            <Box customClass="profile-widget profile-widget-full">
                <Skeleton variant="text" width="30%" height={11} />

                <Box customClass="profile-field-row">
                    <Box customClass="profile-field">
                        <Skeleton variant="text" width="40%" height={12} />
                        <Skeleton variant="rounded" width="100%" height={46} />
                    </Box>
                    <Box customClass="profile-field">
                        <Skeleton variant="text" width="40%" height={12} />
                        <Skeleton variant="rounded" width="100%" height={46} />
                    </Box>
                </Box>

                <Box customClass="profile-field">
                    <Skeleton variant="text" width="30%" height={12} />
                    <Skeleton variant="rounded" width="100%" height={46} />
                </Box>

                <Box customClass="profile-field">
                    <Skeleton variant="text" width="25%" height={12} />
                    <Skeleton variant="rounded" width="100%" height={46} />
                </Box>

                <Box customClass="profile-field">
                    <Skeleton variant="text" width="30%" height={12} />
                    <Skeleton variant="rounded" width="100%" height={46} />
                </Box>

                <Box customClass="profile-field">
                    <Skeleton variant="text" width="35%" height={12} />
                    <Skeleton variant="rounded" width="100%" height={46} />
                </Box>

                <Skeleton variant="rounded" width="100%" height={48} />
            </Box>
            </Box>
        </>
    );
}
