import clsx from "clsx";
import "./stat-card.scss";

interface IStatCardProps {
    label: string;
    value: string;
    icon?: React.ReactNode;
    valueColor?: "default" | "primary" | "accent" | "positive" | "negative";
    className?: string;
    customClass?: string;
}

function StatCard({
    label,
    value,
    icon,
    valueColor = "default",
    className,
    customClass,
}: IStatCardProps) {
    return (
        <div className={clsx("common-statcard", customClass, className)}>
            {icon && <span className="statcard-icon">{icon}</span>}
            <span className={clsx("statcard-value", `val-${valueColor}`)}>
                {value}
            </span>
            <span className="statcard-label">{label}</span>
        </div>
    );
}

export default StatCard;
