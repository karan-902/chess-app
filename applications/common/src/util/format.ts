import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

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

export function formatMMSS(totalSeconds: number): string {
 return dayjs.duration(Math.max(0, totalSeconds), "seconds").format("m:ss");
}

export function shortenUsername(username: string): string {
 const trimmed = username?.trim() ?? "";
 if (/[0-9_-]/.test(trimmed)) return trimmed;
 return trimmed.split(/\s+/)[0] ?? trimmed;
}
