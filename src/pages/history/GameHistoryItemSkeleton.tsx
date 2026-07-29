import Card from "@/components/base/Card/Card";
import Box from "@/components/base/Box/Box";
import Skeleton from "@/components/base/Skeleton/Skeleton";

export default function GameHistoryItemSkeleton() {
    return (
        <Card customClass="history-item">
            <Skeleton variant="circle" width={36} height={36} />
            <Box customClass="history-info">
                <Skeleton variant="text" width="55%" height={14} />
                <Skeleton variant="text" width="75%" height={11} />
            </Box>
            <Box customClass="history-amounts">
                <Skeleton variant="text" width={56} height={14} />
            </Box>
        </Card>
    );
}
