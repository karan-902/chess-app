import {
    Accordion as MuiAccordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import type { AccordionProps } from "@mui/material";
import { ChevronDown } from "../images";
import classNames from "classnames";
import "./accordion.scss";

interface IAccordionProps extends AccordionProps {
    customClass?: string;
    summary: React.ReactNode;
}

export function Accordion({
    customClass,
    summary,
    children,
    ...props
}: IAccordionProps) {
    return (
        <MuiAccordion {...props} className={classNames("common-accordion", customClass)}>
            <AccordionSummary expandIcon={<ChevronDown size={16} />}>
                {summary}
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </MuiAccordion>
    );
}

export default Accordion;
