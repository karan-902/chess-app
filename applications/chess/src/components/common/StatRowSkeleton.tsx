import Box from "@/components/base/Box/Box";
import Skeleton from "@/components/base/Skeleton/Skeleton";

export default function StatRowSkeleton() {
    return (
        <Box customClass="matches-stat-row">
            <Skeleton customClass="text" width={100} height={14} />
            <Skeleton customClass="text" width={40} height={16} />
        </Box>
    );
}
