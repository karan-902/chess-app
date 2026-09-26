import {
 Select as MuiSelect,
 MenuItem,
 Autocomplete,
 TextField,
} from "@mui/material";
import { KeyboardArrowDownIcon } from "../images";
import classNames from "classnames";
import Box from "../Box/Box";
import AlertMessage from "../AlertMessage/AlertMessage";
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
 searchable?: boolean;
 searchPlaceholder?: string;
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
 searchable = false,
 searchPlaceholder = "Search…",
 isError,
 helperText,
 disabled,
 customClass,
}: ISelectProps) {
 const selected = options.find((option) => option.value === value) ?? null;

 return (
  <Box customClass={classNames("common-select", customClass)}>
   {searchable ? (
    <Autocomplete
     options={options}
     getOptionLabel={(option) => option.label}
     value={selected}
     popupIcon={<KeyboardArrowDownIcon />}
     disablePortal
     onChange={(_e, next) => onChange(next?.value ?? "")}
     isOptionEqualToValue={(option, val) => option.value === val.value}
     disabled={disabled}
     renderInput={(params) => (
      <TextField
       {...params}
       placeholder={searchPlaceholder}
       error={isError}
       onBlur={() => onBlur?.()}
      />
     )}
    />
   ) : (
    <MuiSelect
     value={value}
     onChange={(e) => onChange(e.target.value)}
     onBlur={() => onBlur?.()}
     displayEmpty
     error={isError}
     disabled={disabled}
     fullWidth
     IconComponent={KeyboardArrowDownIcon}
     MenuProps={{
      anchorOrigin: { vertical: "bottom", horizontal: "left" },
      transformOrigin: { vertical: "top", horizontal: "left" },
     }}
     renderValue={() => selected?.label ?? placeholder}
    >
     {options.map((option) => (
      <MenuItem key={option.value} value={option.value}>
       {option.label}
      </MenuItem>
     ))}
    </MuiSelect>
   )}
   {isError && helperText && (
    <AlertMessage severity="error" message={helperText} />
   )}
  </Box>
 );
}

export default CustomSelect;
