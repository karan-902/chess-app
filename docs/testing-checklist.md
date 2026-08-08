# Shatranj — Full QA Test Plan

Real money moves through this app (BTC deposits/withdrawals, USD stakes), so
"looks right" isn't good enough for the wallet/game-settlement paths —
those need to be *provably* correct. Check off each box as you verify it.
Anything that references a specific number (thresholds, timeouts, formulas)
is pulled directly from the current code, not guessed.

---

## 1. Authentication & Registration

- [ ] Register with a new email → account created, redirected correctly
- [ ] Register with an already-registered email → `USER_ALREADY_EXIST` shown, no duplicate account created
- [ ] Register with Google SSO → works; register again with same Google account → signs in instead of erroring
- [ ] Login with wrong password → `INCORRECT_PASSWORD`, no session created
- [ ] Login with an email that doesn't exist → `USER_NOT_FOUND` (doesn't leak whether the email exists vs. wrong password, if that's intentional — confirm)
- [ ] Forgot password → email sent; response is identical whether or not the email is registered (`FORGOT_PASSWORD_SUCCESS` either way) — confirm this doesn't leak account existence
- [ ] Reset password with an expired/already-used link → rejected cleanly
- [ ] Reset password on a Google-only account → `GOOGLE_ACCOUNT_RESET_NOT_ALLOWED`
- [ ] Skill level not yet selected → socket connection should NOT establish (`session?.skill_level === null` gate) until it's set
- [ ] Access token expires mid-session → silently refreshes via refresh token, user never sees a hard logout
- [ ] Refresh token itself is invalid/expired → `SESSION_EXPIRED`/`SESSION_INVALID`, forced back to `/login`
- [ ] Log out → session actually invalidated server-side (old access token stops working immediately, not just client-side token deletion)

## 2. Single-Device Login / Device Handoff

- [ ] Log in on Device A, then log in on Device B with the same account → Device A gets a `device_handoff_request` and shows **DeviceHandoffModal** with Device B's real device/browser name
- [ ] On Device A's modal, click **"Continue Here"** → Device B's session is killed, Device A keeps working uninterrupted
- [ ] On Device A's modal, click **"Stay on Other Device"** → Device A is logged out and redirected to `/login`, Device B becomes the active session
- [ ] Ignore the modal on Device A entirely and keep using it → does it silently lose auth mid-action once Device B's `sessionVersion` supersedes it? (verify the ~immediate invalidation via `sessionVersion` check works, not just "eventually on next token refresh")
- [ ] Device name detection: test from at least Chrome/Safari/Firefox on desktop + one mobile browser — confirm `parseDeviceName()` produces something recognizable, not blank/garbage
- [ ] Trigger a device handoff **while** the first device has an active PVP game open with a pending `RejoinGameModal` — handoff modal must win; rejoin modal must not flash or double-render (`deviceHandoffPendingRef` guard)
- [ ] Log in from the same device/browser twice in a row (refresh, not a new device) → should NOT trigger a handoff conflict against itself

## 3. Wallet — Deposit

- [ ] Deposit exactly `$1.00` (the minimum) → succeeds
- [ ] Deposit `$0.99` → inline red error under the amount field (`isError`/`helperText` on the Input), **not** a toast
- [ ] Deposit with empty amount → Generate button stays disabled, can't submit
- [ ] Click a preset chip ($10/$25/$50/$100/$500) after a manual entry had an error showing → error clears immediately
- [ ] Generate a Bitcoin address → QR renders, address is copyable, "Bitcoin ✓" tab active by default
- [ ] Switch to Lightning tab → QR/payment request updates accordingly
- [ ] Let the payment expire (countdown hits 0) → UI shows expired state, no longer accepts that QR as valid
- [ ] Actually pay the invoice (real Speed testnet/sandbox payment if available) → webhook fires → balance updates in real time (`wallet_updated`) AND a `transaction_completed` **toast** appears (`"Deposit confirmed — $X added to your balance."`) — test this **while sitting on a completely different page**, not just with the modal open
- [ ] Simulate/force the same webhook event twice (Speed retry behavior) → balance must not double-credit, and the toast must not fire twice
- [ ] Cancel/close the modal mid-QR-screen, then let the payment actually complete anyway → toast + balance update should still land (global listener, not modal-scoped)
- [ ] Desktop modal: resize browser to exactly 768–905px wide → board/panel layout must not overflow; verify on both the amount-entry screen (should be vertically centered, not top-stuck) and the QR screen (should scroll internally if content overflows the fixed panel height, header/footer stay pinned)
- [ ] Shatranj logo renders correctly in the side panel (not the old broken/wrong `tryspeed.com` image)

## 4. Wallet — Withdraw

- [ ] Withdraw exactly your full `withdrawable` balance → succeeds, balance goes to $0 win-amount
- [ ] Withdraw more than your winnings (but less than total balance, if deposit funds are separate) → rejected with `WITHDRAWAL_EXCEEDS_WINNINGS` — confirm you genuinely can't withdraw un-won deposit money
- [ ] Withdraw with an invalid/malformed destination address → `INVALID_WITHDRAW_DESTINATION`, no balance deducted
- [ ] Withdraw, then the Speed `/send` call fails (simulate network error if possible) → balance must be **refunded** automatically (`refundFailedWithdraw`), not silently lost — check the transaction history shows a `WITHDRAW_REFUND` row
- [ ] Trigger two withdrawals back-to-back rapidly (double-click, or two tabs) for an amount that only one can afford → the second must fail cleanly on `INSUFFICIENT_BALANCE`, not double-spend (this is the balance-decrement-as-lock mechanism — worth specifically hammering)
- [ ] A real withdrawal that completes via the async webhook path → `transaction_completed` toast fires (`"Withdrawal of $X completed."`) exactly once, from any page
- [ ] A withdrawal that completes synchronously (Speed returns `status:"paid"` immediately in the `/send` response) → confirm **no** toast fires here (this path was deliberately narrowed to webhook-only) — balance still updates correctly even without the toast
- [ ] Duplicate webhook delivery for the same withdrawal → no double-toast, no double-balance-change (`updated.count > 0` guard)

## 5. Wallet — Balance, Stats & Transaction List

- [ ] Deposited/Withdrawn/Net Payouts stats match the actual sum of your transaction history exactly (these come from a backend `groupBy`, not client-side math — cross-check by hand on a small number of transactions)
- [ ] "Net Payouts" is specifically the sum of `PAYOUT`-type transactions only, not a net-of-everything figure
- [ ] Transaction list pagination (`Load more`) — no duplicate rows, no skipped rows across the page boundary
- [ ] Pending withdrawal amount is reflected somewhere (not just vanished from the balance with no explanation)

## 6. Matchmaking

- [ ] Join a pool's queue → see yourself counted in that pool's online/queued stats
- [ ] Two different users join the same pool around the same time → matched together, both land in the same `game_id`
- [ ] Join a pool you can't afford (balance < stake) → rejected before ever entering the queue, or matched-but-refunded with `INSUFFICIENT_STAKE_BALANCE` if the opponent's side is the one that's short
- [ ] Queue timeout: bullet pool (`time_seconds <= 60`) times out queueing after **30s**; every other pool after **60s** — verify both thresholds, not just one
- [ ] Leave the queue manually before being matched → cleanly removed, no ghost entry left counted in pool stats
- [ ] Close the tab entirely while queued (not clicking "leave") → you're removed from the queue (`clearUserFromAllQueues` on disconnect/reconnect) rather than stuck occupying a slot forever
- [ ] All 4 real pools match their catalog values exactly: Bullet $1/1+0 → $1.76 prize; Blitz $5/3+2 → $8.80; Rapid $25/10+0 → $44; Classical $100/30+0 → $176 (all = stake × 2 × 0.88)

## 7. Gameplay — PVP Core

- [ ] Legal moves only accepted; illegal move attempts are silently rejected (no crash, no state corruption)
- [ ] Both players' boards stay in sync move-for-move (no drift after 20+ moves)
- [ ] Move history panel updates correctly, including SAN notation for captures, checks, castling
- [ ] Draw offer → opponent sees the offer banner; Accept ends the game as a draw with correct refund math (stake minus 12% fee, split evenly per the `drawFee`/`drawRefund` calc); Decline dismisses cleanly and lets the game continue
- [ ] Resign → immediate loss for the resigner, correct payout to the opponent, correct ELO change on both sides
- [ ] Checkmate, stalemate, draw by repetition, draw by insufficient material, 50-move rule — each ends the game with the *correct* result and reason (not misclassified as e.g. "abandoned")
- [ ] Pawn promotion — all four piece choices (Q/R/B/N) work and are reflected correctly on both clients
- [ ] Castling (both sides, both colors) and en passant behave per standard chess rules
- [ ] Time control clock counts down correctly for the side to move only; the side *not* moving doesn't lose time
- [ ] Blitz increment (+2000ms, only for the 3+2 time control) is actually applied after each move — verify it does **not** apply to bullet/rapid/classical
- [ ] Running out of time ends the game via `"timeout"` with correct winner/payout — test for both colors
- [ ] Rematch offer after a game ends → both accept → new game created with stakes re-escrowed correctly, ELO/history reflects it as a distinct game

## 8. Gameplay — PVP Disconnect / Reconnect (new this session, needs real-network testing, not just code review)

- [ ] Disconnect (kill network, don't just close cleanly) mid-game → opponent sees "opponent disconnected" toast **and both clocks visibly stop ticking**
- [ ] Reconnect within the 60s grace window → clocks resume from the exact frozen value (not extra/lost time); opponent gets "reconnected" toast; game continues normally
- [ ] Let the full 60s elapse without reconnecting → game auto-ends, disconnected player recorded as the loser, opponent as winner, payout/ELO applied
- [ ] **Race condition**: disconnect when the disconnected player has only a couple of seconds left on their own clock — does it end via `"timeout"` before the 60s grace fires, or does the freeze pre-empt the timeout entirely? (verify which wins and that it's not a crash/double-settlement)
- [ ] Open the same game in two tabs as the same user, close one tab → opponent must **not** see a disconnect (the other tab is still an active socket — `isActiveSocket` check)
- [ ] Refresh the page (fast disconnect+reconnect) vs. genuinely losing network for 10+ seconds — does a fast refresh even surface the opponent-facing toast, or does it resolve invisibly fast?
- [ ] Flaky connection: disconnect/reconnect 3+ times rapidly in a row → clock must never end up stuck paused, never double-counts frozen time, no duplicate grace timers left running
- [ ] Reload the app entirely (not just socket reconnect) while a PVP game is active elsewhere → `RejoinGameModal` appears with correct opponent name/rating/stake; "Rejoin Now" returns you to the live game in the correct color/turn state; "Exit" dismisses without abandoning the game server-side

## 9. Gameplay — PVC

- [ ] All three difficulties (easy/medium/hard) produce noticeably different engine strength
- [ ] Stockfish doesn't hang or crash on long games / unusual positions
- [ ] Inactivity timeout now scales per time control instead of a flat 180s — verify: Bullet (60s) → **15s** grace; Blitz (300s) → **60s** grace; Rapid (600s) → **60s** grace; Classical (1800s) → **90s** grace. Blitz landing on 60s (not an "intuitive" 30s) is correct per the actual bucket math — don't flag it as a bug if it matches this
- [ ] Letting the inactivity timer expire actually ends the game as a loss, doesn't just hang
- [ ] No stake-escrow/settlement side effects for PVC (it's not real money — confirm nothing in the wallet moves for a PVC game)

## 10. Game Settlement & Economics (money-critical — verify with real numbers, not spot checks)

- [ ] Win: prize credited = `(stake × 2) × 0.88`, exactly (test with at least 2 different stake tiers)
- [ ] Loss: stake is fully forfeited, no partial refund
- [ ] Draw: each player refunded `stake × 0.88` (a `drawFee` of 12% of stake is *not* returned to either side — confirm this fee application, since it's easy to mis-implement as "refund minus fee only once" instead of "minus fee for each side")
- [ ] Abandonment/disconnect-loss uses the same payout math as a resignation loss, not a different formula
- [ ] `Balance.winAmount` only increases from actual wins/refunds — never from deposits (deposits should only bump `depositAmount`/`amount`, not `winAmount`) — this is what gates what's withdrawable
- [ ] ELO changes are symmetric and bounded correctly (winner gains what loser loses, roughly, per the standard Elo formula — sanity check a few known rating pairs)
- [ ] Win streaks increment on consecutive wins, reset to 0 on a loss, and `bestStreak` only updates when the current streak actually exceeds the prior best

## 11. Game History

- [ ] Every completed game (win/loss/draw/abandon) shows up exactly once
- [ ] Settlement amount shown matches what actually hit the balance for that game
- [ ] Pagination (`ending_before` cursor) doesn't skip or duplicate rows across pages
- [ ] History stats (win rate, total games, net P&L) match manual recomputation from the visible rows

## 12. Leaderboard

- [ ] Players below `MIN_GAMES_FOR_LEADERBOARD` (5 games) do not appear, even with a great win rate on very few games
- [ ] Only players with `earnings > 0` appear (confirm negative-earners are correctly excluded, not just sorted low)
- [ ] Leaderboard updates within ~60s of a new qualifying result (cache TTL) — don't expect instant reflection, but confirm it does update
- [ ] Your own row is visually highlighted when you're within the visible ranks

## 13. Profile

- [ ] Avatar seed/selection persists and displays consistently across Lobby, Play, History, Leaderboard
- [ ] Skill level, once set at signup, displays correctly and (if immutable) can't be silently changed elsewhere
- [ ] Elo rating shown on profile matches what's used to seed a new PVP opponent's displayed rating

## 14. Real-Time / Socket Infrastructure

- [ ] Online user count updates live as users connect/disconnect across multiple browser sessions
- [ ] A same-user page refresh does **not** cause a visible online-count flicker (down-then-up) — there's a grace window specifically for this, confirm it holds
- [ ] `activity_feed` global win toasts appear for *other* users' wins in real time while you're anywhere in the app
- [ ] Socket reconnect after a server restart/deploy re-establishes cleanly without requiring a manual page refresh

## 15. Responsive / Cross-Device UI

- [ ] Full pass at 375px (small mobile), 768px (tablet/`$md` boundary), 1024px+ (desktop) — no horizontal overflow anywhere, especially the Play page board/notation-column layout and the Deposit modal
- [ ] Play page mobile top/bottom bars vs. desktop single-row layout — confirm neither renders both simultaneously at any width (the CSS `display:none` boundaries were a real bug source this session)
- [ ] Captured-piece chips, king badges, and turn indicators remain legible against the board at small sizes

## 16. Currency & Amount Formatting

- [ ] Whole-dollar amounts always show `.00` (e.g. `$5.00`, not `$5`) everywhere `formateAmount` is used
- [ ] No leftover references anywhere in the UI to sats/BTC-equivalent figures for in-app stakes/settlements (this was fully removed — if any screen still shows a sats number, that's a regression)
- [ ] Very small ($1) and larger (hundreds) stake amounts both format without rounding artifacts

## 17. Error Handling & Resilience

- [ ] Backend down / network error during any action (deposit, withdraw, move, matchmaking) → user gets a clear error, not a silent hang or a raw stack trace
- [ ] Rapid double-clicks on any submit-type button (Generate deposit, Withdraw, Resign, Accept draw) → no duplicate requests fire
- [ ] Browser back/forward navigation mid-game doesn't desync game state or bypass the "quit game" confirmation dialog
