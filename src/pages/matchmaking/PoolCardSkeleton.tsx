import Card from "@/components/base/Card/Card";
import Box from "@/components/base/Box/Box";
import Skeleton from "@/components/base/Skeleton/Skeleton";

export default function PoolCardSkeleton() {
    return (
        <Card customClass="pool-card">
            <Box customClass="pool-category-row">
                <Skeleton variant="text" width={64} height={10} />
            </Box>

            <Box customClass="pool-card-top">
                <Box>
                    <Box customClass="pool-stake-row">
                        <Skeleton variant="circle" width={13} height={13} />
                        <Skeleton variant="text" width={72} height={16} />
                    </Box>
                    <Box customClass="pool-meta">
                        <Skeleton variant="text" width={48} height={11} />
                    </Box>
                </Box>
                <Box customClass="pool-right">
                    <Skeleton variant="text" width={56} height={14} />
                    <Skeleton variant="text" width={28} height={10} />
                </Box>
            </Box>

            <Box customClass="pool-card-bottom">
                <Box customClass="pool-stat">
                    <Skeleton variant="text" width={58} height={11} />
                </Box>
                <Box customClass="pool-stat">
                    <Skeleton variant="text" width={58} height={11} />
                </Box>
            </Box>
        </Card>
    );
}
