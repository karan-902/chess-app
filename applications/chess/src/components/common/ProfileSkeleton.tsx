import Box from "@/components/base/Box/Box";
import Card from "@/components/base/Card/Card";
import Skeleton from "@/components/base/Skeleton/Skeleton";
import StatRowSkeleton from "@/components/common/StatRowSkeleton";

export default function ProfileSkeleton() {
    return (
        <Box customClass="profile-page">
            <Card customClass="profile-id-card">
                <Box customClass="profile-id-row">
                    <Skeleton
                        variant="circular"
                        customClass="circle"
                        width={44}
                        height={44}
                    />
                    <Box customClass="profile-id-text">
                        <Skeleton customClass="text" width={100} height={16} />
                        <Skeleton
                            customClass="text"
                            width={70}
                            height={12}
                            style={{ marginTop: "0.3rem" }}
                        />
                    </Box>
                </Box>
            </Card>

            <Card customClass="matches-stat-list">
                {Array.from({ length: 6 }, (_, i) => (
                    <StatRowSkeleton key={i} />
                ))}
            </Card>

            <Skeleton
                customClass="text"
                width={150}
                height={17}
                style={{ margin: "0.9rem 0 0.6rem" }}
            />
            <Card customClass="matches-stat-list">
                {Array.from({ length: 4 }, (_, i) => (
                    <StatRowSkeleton key={i} />
                ))}
            </Card>

            <Skeleton
                customClass="text"
                width={70}
                height={17}
                style={{ margin: "0.9rem 0 0.6rem" }}
            />
            <Card customClass="matches-stat-list">
                <StatRowSkeleton />
                <StatRowSkeleton />
                <StatRowSkeleton />
                <StatRowSkeleton />
            </Card>
        </Box>
    );
}
