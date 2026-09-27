import Card from "@gopvp/common/src/components/Card/Card";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";

export default function LbRowSkeleton() {
    return (
        <Card customClass="lb-row">
            <Skeleton
                variant="circular"
                width={22}
                height={22}
                customClass="circular"
            />
            <Skeleton
                customClass="text"
                width="45%"
                height={14}
                style={{ flex: 1 }}
            />
            <Skeleton customClass="text" width={30} height={13} />
        </Card>
    );
}
