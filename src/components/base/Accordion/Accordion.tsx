import {
    Accordion as MuiAccordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import type { AccordionProps } from "@mui/material";
import { ChevronDown } from "lucide-react";
import classNames from "classnames";
import "./accordion.scss";

interface IAccordionProps extends AccordionProps {
    customClass?: string;
    summary: React.ReactNode;
}

export default function Accordion({
    customClass,
    summary,
    children,
    ...props
}: IAccordionProps) {
    const classes = classNames("accordion", customClass);
    return (
        <MuiAccordion {...props} className={classes}>
            <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                {summary}
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </MuiAccordion>
    );
}
