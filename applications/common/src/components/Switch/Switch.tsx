import type { ChangeEvent } from "react";
import { Toggle as NeoPopToggle } from "@cred/neopop-web/lib/components";
import classNames from "classnames";
import "./switch.scss";

interface ISwitchProps {
 checked?: boolean;
 onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
 customClass?: string;
}

const MUTED = "color-mix(in srgb, var(--app-text) 60%, transparent)";

const TOGGLE_COLORS = {
 on: {
  switchBackground: "var(--gold)",
  switchBorder: "var(--gold)",
  buttonBackground: "#ffffff",
  buttonBorder: "var(--gold)",
  buttonMarkBackground: "var(--gold)",
 },
 off: {
  switchBackground: "transparent",
  switchBorder: MUTED,
  buttonBackground: "#ffffff",
  buttonBorder: MUTED,
  buttonMarkBackground: "rgba(0, 0, 0, 0.25)",
 },
};

export function CustomSwitch({ checked, onChange, customClass }: ISwitchProps) {
 return (
  <span className={classNames("common-switch", customClass)}>
   <NeoPopToggle
    isChecked={!!checked}
    onChange={onChange}
    colorConfig={TOGGLE_COLORS}
   />
  </span>
 );
}

export default CustomSwitch;
