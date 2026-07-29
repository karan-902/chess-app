import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import clsx from "clsx";
import Box from "../Box/Box";
import Button from "../Button/Button";
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
    customClass?: string;
}

function Select({
    value,
    onChange,
    options,
    placeholder = "Select…",
    searchable = false,
    searchPlaceholder = "Search…",
    isError,
    customClass,
}: ISelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const wrapRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selected = options.find((option) => option.value === value);
    const filtered = searchable
        ? options.filter((option) =>
              option.label.toLowerCase().includes(search.toLowerCase()),
          )
        : options;

    useEffect(() => {
        if (open && searchable) setTimeout(() => inputRef.current?.focus(), 30);
        else setSearch("");
    }, [open, searchable]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
                setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const select = (v: string) => {
        onChange(v);
        setOpen(false);
    };

    return (
        <Box customClass={clsx("common-select", customClass)} ref={wrapRef}>
            {open && searchable ? (
                <Box customClass="select-trigger select-trigger--open select-trigger--search">
                    <Search
                        size={13}
                        strokeWidth={2}
                        className="select-search-icon"
                    />
                    <input
                        ref={inputRef}
                        className="select-search"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <ChevronDown
                        size={14}
                        strokeWidth={2}
                        className="select-chevron select-chevron--up"
                        onClick={() => setOpen(false)}
                        style={{ cursor: "pointer" }}
                    />
                </Box>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    customClass={clsx(
                        "select-trigger",
                        open && "select-trigger--open",
                        isError && "select-trigger--error",
                    )}
                    onClick={() => setOpen((o) => !o)}
                >
                    <span
                        className={clsx(
                            "select-value",
                            !selected && "select-value--placeholder",
                        )}
                    >
                        {selected ? selected.label : placeholder}
                    </span>
                    <ChevronDown
                        size={14}
                        strokeWidth={2}
                        className={clsx(
                            "select-chevron",
                            open && "select-chevron--up",
                        )}
                    />
                </Button>
            )}
            {open && (
                <Box customClass="select-dropdown">
                    <Box customClass="select-list">
                        {filtered.length === 0 && (
                            <Box customClass="select-empty">No results</Box>
                        )}
                        {filtered.map((option) => (
                            <Button
                                key={option.value}
                                type="button"
                                variant="ghost"
                                customClass={clsx(
                                    "select-option",
                                    option.value === value &&
                                        "select-option--selected",
                                )}
                                onClick={() => select(option.value)}
                            >
                                <span>{option.label}</span>
                                {option.value === value && (
                                    <Check size={12} strokeWidth={2.5} />
                                )}
                            </Button>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default Select;
