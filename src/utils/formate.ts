import { Currency } from "@/types/types";

export function formateAmount(amount: number, currency: Currency): string {
    if (currency === "BTC") {
        return `${parseFloat(amount.toFixed(8))} BTC`;
    }
    return `$${amount.toFixed(2)}`;
}

export function formateTimeControl(time: string): string {
    const [minStr, incStr] = time.split("+");
    const min = parseInt(minStr, 10);
    const inc = parseInt(incStr ?? "0", 10);
    const base = min >= 60 ? `${min / 60}h` : `${min} min`;
    return inc > 0 ? `${base}  +${inc} sec/move` : base;
}
