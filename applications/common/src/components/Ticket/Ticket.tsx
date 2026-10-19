import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import type { ITicketProps } from "@gopvp/common/src/types/component";
import "./ticket.scss";

export const Ticket = forwardRef<HTMLDivElement, ITicketProps>(
 ({ stub, top, bottom, customClass }, ref) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const perfRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

  useLayoutEffect(() => {
   const root = rootRef.current;
   const perf = perfRef.current;
   if (!root || !perf) return;
   const place = () =>
    root.style.setProperty("--perf-y", `${perf.offsetTop}px`);
   place();
   const observer = new ResizeObserver(place);
   observer.observe(root);
   return () => observer.disconnect();
  }, []);

  return (
   <Box ref={rootRef} customClass={classNames("common-ticket", customClass)}>
    <Box customClass="ticket-stub">{stub}</Box>
    <Box customClass="ticket-body">{top}</Box>
    <Box ref={perfRef} customClass="ticket-perf" />
    <Box customClass="ticket-body">{bottom}</Box>
   </Box>
  );
 },
);

Ticket.displayName = "Ticket";

export default Ticket;
