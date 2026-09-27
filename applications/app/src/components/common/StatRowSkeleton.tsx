import Box from "@gopvp/common/src/components/Box/Box";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";

export default function StatRowSkeleton() {
    return (
        <Box customClass="stat-row">
            <Skeleton customClass="text" width={100} height={14} />
            <Skeleton customClass="text" width={40} height={16} />
        </Box>
    );
}
