import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import clsx from "clsx";
import Box from "../Box/Box";

export const COUNTRIES = [
    "Afghanistan","Albania","Algeria","Argentina","Australia","Austria","Bangladesh",
    "Belgium","Brazil","Canada","Chile","China","Colombia","Croatia","Czech Republic",
    "Denmark","Egypt","Ethiopia","Finland","France","Germany","Ghana","Greece",
    "Hungary","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Japan",
    "Jordan","Kenya","Malaysia","Mexico","Morocco","Netherlands","New Zealand",
    "Nigeria","Norway","Pakistan","Peru","Philippines","Poland","Portugal","Romania",
    "Russia","Saudi Arabia","Serbia","Singapore","South Africa","South Korea","Spain",
    "Sri Lanka","Sweden","Switzerland","Thailand","Turkey","Ukraine","United Arab Emirates",
    "United Kingdom","United States","Venezuela","Vietnam",
];

interface ICountrySelectProps {
    value: string;
    onChange: (v: string) => void;
    isError?: boolean;
}

export default function CountrySelect({ value, onChange, isError }: ICountrySelectProps) {
    const [open, setOpen]     = useState(false);
    const [search, setSearch] = useState("");
    const wrapRef             = useRef<HTMLDivElement>(null);
    const inputRef            = useRef<HTMLInputElement>(null);

    const filtered = COUNTRIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 30);
        else setSearch("");
    }, [open]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const select = (c: string) => { onChange(c); setOpen(false); };

    return (
        <Box customClass="cs-wrap" ref={wrapRef}>
            {open ? (
                <Box customClass="cs-trigger cs-trigger--open cs-trigger--search">
                    <Search size={13} strokeWidth={2} className="cs-search-icon" />
                    <input
                        ref={inputRef}
                        className="cs-search"
                        placeholder="Search country…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <ChevronDown
                        size={14}
                        strokeWidth={2}
                        className="cs-chevron cs-chevron--up"
                        onClick={() => setOpen(false)}
                        style={{ cursor: "pointer" }}
                    />
                </Box>
            ) : (
                <button
                    type="button"
                    className={clsx("cs-trigger", isError && "cs-trigger--error")}
                    onClick={() => setOpen(true)}
                >
                    <span className={clsx("cs-value", !value && "cs-value--placeholder")}>
                        {value || "Select country"}
                    </span>
                    <ChevronDown size={14} strokeWidth={2} className="cs-chevron" />
                </button>
            )}
            {open && (
                <Box customClass="cs-dropdown">
                    <Box customClass="cs-list">
                        {filtered.length === 0 && <Box customClass="cs-empty">No results</Box>}
                        {filtered.map(c => (
                            <button
                                key={c}
                                type="button"
                                className={clsx("cs-option", c === value && "cs-option--selected")}
                                onClick={() => select(c)}
                            >
                                <span>{c}</span>
                                {c === value && <Check size={12} strokeWidth={2.5} />}
                            </button>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
