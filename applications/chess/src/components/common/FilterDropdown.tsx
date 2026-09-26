import { useState } from "react";
import { Check } from "@/components/base/images";
import Button from "@/components/base/Button/Button";
import CustomMenu from "@/components/base/Menu/Menu";
import CustomMenuItem from "@/components/base/MenuItem/MenuItem";
import type { IFilterDropdownProps } from "@gopvp/common/src/types/component";

export default function FilterDropdown<T extends string>({
 options,
 value,
 onChange,
 label,
}: IFilterDropdownProps<T>) {
 const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
 const isOpen = !!anchorEl;

 const selectOption = (option: T) => {
  onChange(option);
  setAnchorEl(null);
 };

 return (
  <>
   <Button
    type="button"
    customClass="filter-dropdown-btn"
    endIcon={isOpen ? "chevronUp" : "chevronDown"}
    aria-haspopup="menu"
    aria-expanded={isOpen}
    onClick={(event) => setAnchorEl(event.currentTarget)}
   >
    {label(value)}
   </Button>
   <CustomMenu
    customClass="filter-dropdown-menu"
    anchorEl={anchorEl}
    open={isOpen}
    onClose={() => setAnchorEl(null)}
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    transformOrigin={{ vertical: "top", horizontal: "left" }}
   >
    {options.map((option) => (
     <CustomMenuItem
      key={option}
      selected={option === value}
      onClick={() => selectOption(option)}
     >
      {label(option)}
      {option === value && <Check size={18} />}
     </CustomMenuItem>
    ))}
   </CustomMenu>
  </>
 );
}
