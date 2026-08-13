import {
    Select as MuiSelect,
    MenuItem,
    Autocomplete,
    TextField,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import classNames from "classnames";
import Box from "../Box/Box";
import "./select.scss";

export interface ISelectOption {
    value: string;
    label: string;
}

interface ISelectProps {
    value: string;
    onChange: (value: string) => void;
    options: ISelectOption[];
    placeholder?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    isError?: boolean;
    disabled?: boolean;
    customClass?: string;
}

export default function Select({
    value,
    onChange,
    options,
    placeholder = "Select…",
    searchable = false,
    searchPlaceholder = "Search…",
    isError,
    disabled,
    customClass,
}: ISelectProps) {
    const classes = classNames("select", customClass);
    const selected = options.find((option) => option.value === value) ?? null;

    if (searchable) {
        return (
            <Box customClass={classes}>
                <Autocomplete
                    options={options}
                    getOptionLabel={(option) => option.label}
                    value={selected}
                    popupIcon={<KeyboardArrowDownIcon />}
                    onChange={(_e, next) => onChange(next?.value ?? "")}
                    isOptionEqualToValue={(option, val) =>
                        option.value === val.value
                    }
                    disabled={disabled}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={searchPlaceholder}
                            error={isError}
                        />
                    )}
                />
            </Box>
        );
    }

    return (
        <Box customClass={classes}>
            <MuiSelect
                value={value}
                onChange={(e) => onChange(e.target.value)}
                displayEmpty
                error={isError}
                disabled={disabled}
                fullWidth
                IconComponent={KeyboardArrowDownIcon}
                renderValue={(v) =>
                    options.find((o) => o.value === v)?.label ?? placeholder
                }
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </MuiSelect>
        </Box>
    );
}
