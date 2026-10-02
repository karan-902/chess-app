import type { ComponentType } from "react";

export const renderSkeletons = (count: number, Skeleton: ComponentType) =>
 Array.from({ length: count }, (_, index) => <Skeleton key={index} />);
