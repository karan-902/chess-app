import dayjs from "dayjs";

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export function formatAmount(amount: number): string {
    return currencyFormatter.format(amount);
}

export function formatTime(date: number | Date): string {
    return dayjs(date).format("h:mm A");
}

export function formatText(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatTimeControl(time: string): string {
    const [minStr, incStr] = time.split("+");
    const min = parseInt(minStr, 10);
    const inc = parseInt(incStr ?? "0", 10);
    const base = min >= 60 ? `${min / 60}h` : `${min} min`;
    return inc > 0 ? `${base}  +${inc} sec/move` : base;
}
