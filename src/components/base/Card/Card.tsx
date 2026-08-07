import { Card as MuiCard } from "@mui/material";
import type { CardProps } from "@mui/material";
import classNames from "classnames";
import "./card.scss";

interface ICardProps extends CardProps {
    customClass?: string;
}

export default function Card({ customClass, onClick, ...props }: ICardProps) {
    const classes = classNames("card", onClick && "clickable", customClass);
    return <MuiCard {...props} className={classes} onClick={onClick} />;
}
