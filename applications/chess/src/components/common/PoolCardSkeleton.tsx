import Card from "@/components/base/Card/Card";
import Box from "@/components/base/Box/Box";
import Skeleton from "@/components/base/Skeleton/Skeleton";

export default function PoolCardSkeleton() {
    return (
        <Card customClass="stake-card">
            <Box customClass="pool-meta">
                <Skeleton variant="circular" width={14} height={14} />
                <Skeleton customClass="text" width={78} height={14} />
            </Box>
            <Skeleton
                customClass="text"
                width={40}
                height={14}
                style={{ marginBottom: "0.35rem", alignSelf: "center" }}
            />
            <Skeleton
                customClass="text"
                width={60}
                height={24}
                style={{ marginTop: "0.1rem", alignSelf: "center" }}
            />
            <Skeleton
                customClass="text"
                width={70}
                height={14}
                style={{ marginTop: "0.25rem", alignSelf: "center" }}
            />
            <Skeleton
                variant="rounded"
                width="100%"
                height={35}
                style={{ marginTop: "auto" }}
            />
        </Card>
    );
}
