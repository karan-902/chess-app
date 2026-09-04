import Box from "@/components/base/Box/Box";
import Skeleton from "@/components/base/Skeleton/Skeleton";

export default function TxItemSkeleton() {
    return (
        <Box customClass="wallet-tx-item loading">
            <Box customClass="wallet-tx-row">
                <Box customClass="wallet-tx-info">
                    <Skeleton variant="circular" width={32} height={32} />
                    <Box customClass="wallet-tx-text">
                        <Skeleton
                            customClass="text"
                            width={110}
                            height={14}
                            style={{ marginBottom: "0.2rem" }}
                        />
                        <Skeleton customClass="text" width={60} height={11} />
                    </Box>
                </Box>
                <Skeleton customClass="text" width={48} height={16} />
            </Box>
        </Box>
    );
}
