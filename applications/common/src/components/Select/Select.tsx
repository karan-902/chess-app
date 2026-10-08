import {
 useEffect,
 useId,
 useRef,
 useState,
 type KeyboardEvent,
} from "react";
import {
 OutlinedInput,
 InputAdornment,
 Popper,
 Paper,
 MenuList,
 MenuItem,
} from "@mui/material";
import { KeyboardArrowDownIcon } from "@gopvp/common/src/components/images";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import AlertMessage from "@gopvp/common/src/components/AlertMessage/AlertMessage";
import { noResultsText } from "@gopvp/common/src/constants/message";
import "./select.scss";

export interface ISelectOption {
 value: string;
 label: string;
}

interface ISelectProps {
 value: string;
 onChange: (value: string) => void;
 onBlur?: () => void;
 options: ISelectOption[];
 placeholder?: string;
 isError?: boolean;
 helperText?: string;
 disabled?: boolean;
 customClass?: string;
}

export function CustomSelect({
 value,
 onChange,
 onBlur,
 options,
 placeholder = "Select…",
 isError,
 helperText,
 disabled,
 customClass,
}: ISelectProps) {
 const listId = useId();
 const anchorRef = useRef<HTMLDivElement>(null);
 const inputRef = useRef<HTMLInputElement>(null);
 const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
 const [open, setOpen] = useState(false);
 const [query, setQuery] = useState<string | null>(null);
 const [activeIndex, setActiveIndex] = useState(0);

 const selected = options.find((option) => option.value === value) ?? null;
 const search = (query ?? "").trim().toLowerCase();
 const isSearching = query !== null && query !== selected?.label;
 const visibleOptions = isSearching
  ? options.filter((option) => option.label.toLowerCase().includes(search))
  : options;

 useEffect(() => {
  if (open) optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
 }, [open, activeIndex]);

 const openMenu = () => {
  if (open || disabled) return;
  setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
  setOpen(true);
 };

 const closeMenu = () => {
  setOpen(false);
  setQuery(null);
 };

 const selectOption = (option: ISelectOption) => {
  onChange(option.value);
  closeMenu();
 };

 const handleBlur = () => {
  const exactMatch = options.find(
   (option) => option.label.toLowerCase() === search,
  );
  if (isSearching && exactMatch) onChange(exactMatch.value);
  closeMenu();
  onBlur?.();
 };

 const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
   e.preventDefault();
   if (!open) return openMenu();
   const step = e.key === "ArrowDown" ? 1 : -1;
   setActiveIndex((i) =>
    Math.min(Math.max(i + step, 0), Math.max(visibleOptions.length - 1, 0)),
   );
  } else if (e.key === "Enter") {
   e.preventDefault();
   if (!open) return openMenu();
   const option = visibleOptions[activeIndex];
   if (option) selectOption(option);
  } else if (e.key === "Escape" && open) {
   e.preventDefault();
   closeMenu();
  }
 };

 return (
  <Box customClass={classNames("common-select", customClass)}>
   <OutlinedInput
    ref={anchorRef}
    inputRef={inputRef}
    fullWidth
    value={query ?? selected?.label ?? ""}
    placeholder={placeholder}
    disabled={disabled}
    error={isError}
    onFocus={openMenu}
    onClick={openMenu}
    onBlur={handleBlur}
    onKeyDown={handleKeyDown}
    onChange={(e) => {
     setQuery(e.target.value);
     setActiveIndex(0);
     setOpen(true);
    }}
    inputProps={{
     role: "combobox",
     autoComplete: "off",
     "aria-expanded": open,
     "aria-controls": listId,
     "aria-activedescendant": open
      ? `${listId}-${activeIndex}`
      : undefined,
    }}
    endAdornment={
     <InputAdornment position="end">
      <KeyboardArrowDownIcon
       className={classNames("select-arrow", open && "open")}
       onMouseDown={(e) => {
        e.preventDefault();
        if (open) closeMenu();
        else if (document.activeElement === inputRef.current) openMenu();
        else inputRef.current?.focus();
       }}
      />
     </InputAdornment>
    }
   />

   <Popper
    open={open}
    anchorEl={anchorRef.current}
    placement="bottom-start"
    className={classNames("common-select-popper", customClass)}
    modifiers={[{ name: "offset", options: { offset: [0, 4] } }]}
    style={{ width: anchorRef.current?.offsetWidth }}
   >
    <Paper className="common-select-menu">
     <MenuList id={listId} role="listbox" dense>
      {visibleOptions.length === 0 ? (
       <MenuItem disabled>{noResultsText}</MenuItem>
      ) : (
       visibleOptions.map((option, index) => (
        <MenuItem
         key={option.value}
         id={`${listId}-${index}`}
         role="option"
         ref={(node) => {
          optionRefs.current[index] = node;
         }}
         selected={option.value === value}
         aria-selected={option.value === value}
         className={classNames(index === activeIndex && "active")}
         onMouseDown={(e) => e.preventDefault()}
         onMouseEnter={() => setActiveIndex(index)}
         onClick={() => selectOption(option)}
        >
         {option.label}
        </MenuItem>
       ))
      )}
     </MenuList>
    </Paper>
   </Popper>

   {isError && helperText && (
    <AlertMessage severity="error" message={helperText} />
   )}
  </Box>
 );
}

export default CustomSelect;
