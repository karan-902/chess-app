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

