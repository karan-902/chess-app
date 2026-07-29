import Card from "@/components/base/Card/Card";
import Box from "@/components/base/Box/Box";
import Skeleton from "@/components/base/Skeleton/Skeleton";

export default function TransactionItemSkeleton() {
    return (
        <Card customClass="tx-item">
            <Skeleton variant="rounded" width={32} height={32} />
            <Box customClass="tx-info">
                <Skeleton variant="text" width="60%" height={14} />
                <Skeleton variant="text" width="35%" height={11} />
            </Box>
            <Box customClass="tx-amounts">
                <Skeleton variant="text" width={56} height={14} />
            </Box>
        </Card>
    );
}
