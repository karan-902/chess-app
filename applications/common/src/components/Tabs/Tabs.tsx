import { useLayoutEffect, useRef } from "react";
import { Tabs as MuiTabs, Tab as MuiTab } from "@mui/material";
import type { TabsProps, TabProps } from "@mui/material";
import classNames from "classnames";
import "./tabs.scss";

interface ITabsProps extends TabsProps {
 customClass?: string;
}
interface ITabProps extends TabProps {
 customClass?: string;
}

export function CustomTabs({ customClass, value, ...props }: ITabsProps) {
 const rootRef = useRef<HTMLDivElement>(null);

 useLayoutEffect(() => {
  const root = rootRef.current;
  if (!root) return;
  const tab = root.querySelector<HTMLElement>(".common-tab.Mui-selected");
  const scroller = root.querySelector<HTMLElement>(".MuiTabs-scroller");
  if (!tab || !scroller) {
   root.style.setProperty("--tab-w", "0");
   return;
  }
  const measure = () => {
   const left =
    tab.getBoundingClientRect().left -
    scroller.getBoundingClientRect().left +
    scroller.scrollLeft;
   root.style.setProperty("--tab-x", `${left}px`);
   root.style.setProperty("--tab-w", `${tab.offsetWidth}`);
  };
  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(tab);
  observer.observe(root);
  return () => observer.disconnect();
 }, [value]);

 return (
  <MuiTabs
   ref={rootRef}
   value={value}
   {...props}
   className={classNames("common-tabs", customClass)}
  />
 );
}

export function CustomTab({ customClass, ...props }: ITabProps) {
 return (
  <MuiTab
   disableRipple
   {...props}
   className={classNames("common-tab", customClass)}
  />
 );
}
