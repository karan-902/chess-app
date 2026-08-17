import { forwardRef } from "react";
import { Card as MuiCard } from "@mui/material";
import type { CardProps } from "@mui/material";
import classNames from "classnames";
import "./card.scss";

interface ICardProps extends CardProps {
    customClass?: string;
}

const Card = forwardRef<HTMLDivElement, ICardProps>(
    ({ customClass, onClick, ...props }, ref) => {
        const classes = classNames("card", onClick && "clickable", customClass);
        return (
            <MuiCard ref={ref} {...props} className={classes} onClick={onClick} />
        );
    },
);

Card.displayName = "Card";

export default Card;
