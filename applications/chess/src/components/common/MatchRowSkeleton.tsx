import Box from "@/components/base/Box/Box";
import Skeleton from "@/components/base/Skeleton/Skeleton";

export default function MatchRowSkeleton() {
    return (
        <Box customClass="match-row-item">
            <Box customClass="match-row">
                <Box customClass="match-row-info">
                    <Box customClass="match-row-icon">
                        <Skeleton variant="circular" width={18} height={18} />
                    </Box>
                    <Box customClass="match-row-text">
                        <Skeleton customClass="text" width={140} height={14} />
                        <Skeleton
                            customClass="text"
                            width={90}
                            height={11}
                            style={{ marginTop: "0.3rem" }}
                        />
                    </Box>
                </Box>
                <Skeleton customClass="text" width={48} height={16} />
            </Box>
        </Box>
    );
}
