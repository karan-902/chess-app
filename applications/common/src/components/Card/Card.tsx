import { forwardRef } from "react";
import { Card as MuiCard } from "@mui/material";
import type { CardProps } from "@mui/material";
import classNames from "classnames";
import "./card.scss";

interface ICardProps extends CardProps {
    customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, ICardProps>(
    ({ customClass, onClick, ...props }, ref) => (
        <MuiCard
            ref={ref}
            {...props}
            className={classNames("common-card", onClick && "clickable", customClass)}
            onClick={onClick}
        />
    ),
);

Card.displayName = "Card";

export default Card;
