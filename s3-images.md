# Images to move to S3

These images are still served from `applications/app/public/`. Upload them to S3, then switch the code to `${imageIconS3Url}/...`, the same way `qrLogo` and `speedLogo` already work (`applications/common/src/components/images.tsx`).

## Move to S3

| # | File | Size | Used in | Suggested S3 path |
|---|---|---|---|---|
| 1 | `gopvp-chess.png` | 964 KB | Chess game logo: game picker (`app/src/constants/icon.tsx`) and game-over payout ticket (`chess/src/pages/play/GameOverOverlay.tsx`), via `GAME_LOGO_PATH` | `gopvp/gopvp-chess.png` |
| 2 | `gopvp-logo.png` | 812 KB | Header logo (`app/src/components/common/Header.tsx`), pool confirm sheet (`app/src/pages/play/PoolConfirmSheet.tsx`), `common/src/components/Box/box.scss` background | `gopvp/gopvp-logo.png` |
| 3 | `hero-logo.webp` | 30 KB | Login/register hero logo (`app/src/container/AuthLayout.tsx`), via `HERO_LOGO_PATH` | `gopvp/hero-logo.webp` |
| 4 | `gopvp-logo-card.webp` | 11 KB | Logo on the match deck cards (`app/src/components/common/MatchDeck.tsx`), via `CARD_LOGO_PATH` | `gopvp/gopvp-logo-card.webp` |

Before uploading, convert the two PNGs (`gopvp-chess.png`, `gopvp-logo.png`) to WebP. That typically makes them 5 to 10 times smaller.

## Keep local

| File | Size | Why |
|---|---|---|
| `gopvp-app-icon.png` | 1.3 MB | Browser tab and iPhone home-screen icon in `app/index.html`. Browsers load these more reliably from the app's own domain. It is far too big for an icon, though: resize it to about 180×180 (~20 KB). |
| `pattern-cubes.svg` | 1 KB | Used as a CSS `mask: url()`. Masks loaded from S3 need extra CORS setup, and the file is tiny. |
| `rival-mask.svg` | 0.6 KB | Same as above (match ticket mask). |

## Already on S3 or a CDN

| Asset | Source |
|---|---|
| `qr-logo.svg`, `speed-logo.svg` | `imageIconS3Url` (`chrome-wallet/` folder) |
| Wallet success and tick animations | `lottieBaseUrl` |
| Country flags | `flagCdnUrl` |

## Missing file

`HERO_COIN_PATH` (`app/src/constants/asset.ts`) points to `hero-coin.webp`, but that file does not exist. Only the parked (commented-out) hero coins in `AuthLayout.tsx` use it, so upload it first if that code comes back.
