import type { ChangeEvent, ReactNode } from "react";
import { Checkbox as NeoPopCheckbox } from "@cred/neopop-web/lib/components";
import classNames from "classnames";

interface ICheckboxProps {
 checked?: boolean;
 defaultChecked?: boolean;
 disabled?: boolean;
 onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
 customClass?: string;
 children?: ReactNode;
}

const CHECKBOX_COLORS = {
 background: "var(--app-bg)",
 border: "var(--app-text)",
 leftPlunk: "color-mix(in srgb, var(--app-text) 50%, transparent)",
 topPlunk: "color-mix(in srgb, var(--app-text) 25%, transparent)",
};

export function CustomCheckbox({
 checked,
 defaultChecked,
 disabled,
 onChange,
 customClass,
 children,
}: ICheckboxProps) {
 return (
  <span className={classNames("common-checkbox", customClass)}>
   <NeoPopCheckbox
    isChecked={checked ?? defaultChecked ?? false}
    onChange={onChange}
    disabled={disabled}
    colorConfig={CHECKBOX_COLORS}
   >
    {children}
   </NeoPopCheckbox>
  </span>
 );
}

export default CustomCheckbox;
