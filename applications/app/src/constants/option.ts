import type {
 LeaderboardScope,
 LeaderboardSort,
} from "@gopvp/common/src/types/index";
import type { MatchesSubtab, RoomTab } from "@gopvp/common/src/types/component";
import { GAME_PAGES } from "@gopvp/app/src/constants/route";
import { GAME_PAGE_TITLES } from "@gopvp/app/src/constants/label";
import { MAX_ROOM_DURATION_MINUTES } from "@gopvp/app/src/constants/limit";

export const LEADERBOARD_SCOPES: LeaderboardScope[] = [
 "daily",
 "weekly",
 "monthly",
 "all",
];

export const LEADERBOARD_SORTS: LeaderboardSort[] = ["earnings", "wins"];

export const LEADERBOARD_PODIUM_PLACES = ["first", "second", "third"];

export const DEFAULT_LEADERBOARD_SCOPE: LeaderboardScope = "all";
export const DEFAULT_LEADERBOARD_SORT: LeaderboardSort = "earnings";

export const NAV_ITEMS = (
 ["PLAY", "MATCHES", "LEADERBOARD", "RULES"] as const
).map((page) => ({ page, label: GAME_PAGE_TITLES[GAME_PAGES[page]] }));

export const MATCHES_SUBTAB_OPTIONS: MatchesSubtab[] = [
 "history",
 "global",
 "stats",
];

export const ROOM_TABS: RoomTab[] = ["create", "join"];

export const BET_CHIP_AMOUNTS = [10, 25, 50];

export const DURATION_MINUTES = Array.from(
 { length: MAX_ROOM_DURATION_MINUTES },
 (_, i) => i + 1,
);

// const COUNTRIES = [
//  "Afghanistan",
//  "Albania",
//  "Algeria",
//  "Argentina",
//  "Australia",
//  "Austria",
//  "Bangladesh",
//  "Belgium",
//  "Brazil",
//  "Canada",
//  "Chile",
//  "China",
//  "Colombia",
//  "Croatia",
//  "Czech Republic",
//  "Denmark",
//  "Egypt",
//  "Ethiopia",
//  "Finland",
//  "France",
//  "Germany",
//  "Ghana",
//  "Greece",
//  "Hungary",
//  "India",
//  "Indonesia",
//  "Iran",
//  "Iraq",
//  "Ireland",
//  "Israel",
//  "Italy",
//  "Japan",
//  "Jordan",
//  "Kenya",
//  "Malaysia",
//  "Mexico",
//  "Morocco",
//  "Netherlands",
//  "New Zealand",
//  "Nigeria",
//  "Norway",
//  "Pakistan",
//  "Peru",
//  "Philippines",
//  "Poland",
//  "Portugal",
//  "Romania",
//  "Russia",
//  "Saudi Arabia",
//  "Serbia",
//  "Singapore",
//  "South Africa",
//  "South Korea",
//  "Spain",
//  "Sri Lanka",
//  "Sweden",
//  "Switzerland",
//  "Thailand",
//  "Turkey",
//  "Ukraine",
//  "United Arab Emirates",
//  "United Kingdom",
//  "United States",
//  "Venezuela",
//  "Vietnam",
// ];

// export const COUNTRY_OPTIONS = COUNTRIES.map((country) => ({
//  value: country,
//  label: country,
// }));
