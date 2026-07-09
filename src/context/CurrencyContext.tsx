import { createContext, useContext, useState, type ReactNode } from "react";
import type { Currency } from "@/constants/currencies";

const CURRENCY_STORAGE_KEY = "kingStake_currency";

interface ICurrencyContext {
    currency: Currency;
    setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<ICurrencyContext>({
    currency: "BTC",
    setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>(() => {
        return (
            (localStorage.getItem(CURRENCY_STORAGE_KEY) as Currency) ?? "BTC"
        );
    });

    const setCurrency = (c: Currency) => {
        localStorage.setItem(CURRENCY_STORAGE_KEY, c);
        setCurrencyState(c);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    return useContext(CurrencyContext);
}
