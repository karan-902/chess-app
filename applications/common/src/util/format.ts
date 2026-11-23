import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import utc from "dayjs/plugin/utc.js";
import { justNowText, timeAgoText } from "@gopvp/common/src/constants/message";
import { COMPACT_AMOUNT_FROM } from "@gopvp/common/src/constants/limit";

dayjs.extend(duration);
dayjs.extend(utc);

const currencyFormatter = new Intl.NumberFormat("en-US", {
 style: "currency",
 currency: "USD",
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
 style: "currency",
 currency: "USD",
 notation: "compact",
});

export function formatAmount(amount: number): string {
 return currencyFormatter.format(amount).replace(/\.00$/, "");
}

export function formatCompactAmount(amount: number): string {
 return Math.abs(amount) < COMPACT_AMOUNT_FROM
  ? formatAmount(amount)
  : compactCurrencyFormatter.format(amount);
}

export function formatTime(date: number | Date): string {
 return dayjs(date).format("h:mm A");
}

export function formatDateTime(date: number | Date): string {
 return dayjs(date).format("D MMM YYYY, hh:mm A");
}

export function formatUtcDateTime(date: number | Date): string {
 return dayjs.utc(date).format("D MMM YYYY, hh:mm A");
}

export function formatNumber(value: number): string {
 return Math.round(value).toLocaleString("en-US");
}

export function formatText(text: string): string {
 return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatMMSS(totalSeconds: number): string {
 return dayjs.duration(Math.max(0, totalSeconds), "seconds").format("m:ss");
}

export function formatTimeAgo(date: number | Date): string {
 const now = dayjs();
 const minutes = now.diff(date, "minute");
 if (minutes < 1) return justNowText;
 const hours = now.diff(date, "hour");
 if (hours < 1) return timeAgoText(minutes, "m");
 const days = now.diff(date, "day");
 return days < 1 ? timeAgoText(hours, "h") : timeAgoText(days, "d");
}

export function shortenUsername(username: string): string {
 const trimmed = username?.trim() ?? "";
 if (/[0-9_-]/.test(trimmed)) return trimmed;
 return trimmed.split(/\s+/)[0] ?? trimmed;
}
