# Player vs Computer — How It Works

## Overview

The computer player is powered by **Stockfish** — a pre-built chess engine that has been developed and optimized for 20+ years. You don't write any chess AI logic yourself. Stockfish does all the thinking.

---

## What is Stockfish?

Stockfish is a chess engine — a program built specifically to find the best chess move in any position. It is:

- Free and open source
- One of the strongest chess engines in the world
- Available as a `.wasm` (WebAssembly) file that runs entirely inside the browser
- Installed via npm: `npm i stockfish`

No backend needed. No internet call needed. It runs locally inside the user's browser tab.

---

## Libraries Used

| Library | Purpose |
|---|---|
| `chess.js` | Chess rules — move validation, legal move generation, check/checkmate detection, FEN generation |
| `stockfish` | Chess AI brain — finds the best move given a board position |

```bash
npm i chess.js stockfish
```

---

## What is FEN?

FEN (Forsyth-Edwards Notation) is a standard way to describe a chess board as a single line of text.

```
Starting position:
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

Breaking it down:
```
rnbqkbnr   → black's back rank  (lowercase = black pieces)
pppppppp   → 8 black pawns
8          → 8 empty squares (one row)
8          → 8 empty squares
8          → 8 empty squares
8          → 8 empty squares
PPPPPPPP   → 8 white pawns     (uppercase = white pieces)
RNBQKBNR   → white's back rank
w          → white to move
KQkq       → castling rights available
-          → no en passant square
0 1        → move counters
```

`chess.js` generates FEN automatically — `game.fen()`. You never write FEN yourself.

---

## How You Talk to Stockfish — UCI Protocol

Stockfish speaks a text-based language called **UCI (Universal Chess Interface)**. You send it text commands, it sends text back.

```
You send:                            Stockfish replies:
────────────────────────────────────────────────────────
uci                            →     uciok
isready                        →     readyok
position fen <FEN string here> →     (nothing, stores it)
go depth 10                    →     bestmove e7e5
```

That's the entire conversation. 4 messages. `bestmove e7e5` means "move the piece from e7 to e5."

---

## Why Web Worker?

Stockfish takes 1–3 seconds to think. If it runs on the main thread, the entire UI freezes — no clicks, no animations, nothing responds.

A **Web Worker** is a separate background thread in the browser. Stockfish runs there, isolated from the UI.

```
Main Thread                        Web Worker
──────────────────                 ──────────────────
React UI running      ←─────────→  Stockfish thinking
User can still click               (doesn't touch UI)
scroll, animate etc
```

Communication between them uses `postMessage()` and `onmessage` — like sending text messages between two phones.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                  Browser Tab                     │
│                                                  │
│   ┌──────────────────┐    ┌──────────────────┐  │
│   │    React App     │    │   Web Worker     │  │
│   │                  │    │                  │  │
│   │  chess.js        │─FEN▶  Stockfish       │  │
│   │  (rules engine)  │    │  .wasm           │  │
│   │                  │◀move─  (AI brain)     │  │
│   │  Board UI        │    │                  │  │
│   └──────────────────┘    └──────────────────┘  │
│                                                  │
│          Everything runs locally                 │
│          No internet call needed                 │
└─────────────────────────────────────────────────┘
```

---

## Complete Flow — Step by Step

### App Startup
```
1. Web Worker loads stockfish.wasm
2. Sends "uci" to initialise
3. Sends "isready" to confirm engine is ready
4. Stockfish replies "readyok" — engine ready to use
```

### Player's Turn
```
5. Player clicks a piece
6. App highlights legal moves (from chess.js)
7. Player clicks destination square
8. chess.js validates the move is legal
9. chess.js updates board internally
10. Board re-renders showing player's move
```

### Engine's Turn
```
11. App calls game.fen() to get current position as text
12. Sends to Worker: postMessage({ fen: '...', depth: 10 })
13. Worker forwards to Stockfish:
       "position fen rnbqkb..."
       "go depth 10"
14. Stockfish searches millions of positions
15. After 1-2 seconds, replies: "bestmove e7e5"
16. Worker sends { bestMove: 'e7e5' } back to main thread
17. App applies: chess.js.move({ from: 'e7', to: 'e5' })
18. Board re-renders with computer's move
19. Back to step 5 — player's turn again
```

---

## Difficulty Control

Control how strong Stockfish plays with depth or time:

### By Depth (moves ahead)
```
go depth 3    →  Beginner   (~0.1 seconds)
go depth 8    →  Medium     (~0.5 seconds)
go depth 15   →  Hard       (~2 seconds)
go depth 20   →  Expert     (~10 seconds)
```

### By Time
```
go movetime 300    →  think for exactly 300ms
go movetime 1000   →  think for exactly 1 second
go movetime 3000   →  think for exactly 3 seconds
```

---

## Implementation Steps

| Step | What | File |
|---|---|---|
| 1 | Install chess.js + stockfish | `package.json` |
| 2 | Create `useChessGame` hook | `src/hooks/useChessGame.ts` |
| 3 | Create Stockfish Web Worker | `src/workers/stockfish.worker.ts` |
| 4 | Create `useStockfish` hook | `src/hooks/useStockfish.ts` |
| 5 | Update Play page to wire it all together | `src/pages/play/index.tsx` |
| 6 | Add mode selector UI (PvP / vs Computer) | `src/pages/matchmaking/index.tsx` |
| 7 | Update PlayerRow to show "Stockfish" as opponent | `src/pages/play/components/PlayerRow.tsx` |

---

## What Needs a Backend?

### PvC (Practice Mode) — No backend needed
Everything runs client-side. chess.js + Stockfish WASM in the browser is all you need.

### PvC (Wagered Mode) — Backend required
| Feature | Why |
|---|---|
| ETH stake handling | Can't trust client to hold/release funds |
| Game result recording | Client can't write its own win/loss |
| Leaderboard | Needs a database + server validation |

---

## How Stockfish "Thinks" — Simple Explanation

1. **Score the board** — each piece has a value (queen=9, rook=5, pawn=1). Good positions get bonus points.

2. **Try every possible move** — builds a tree of all futures going N moves deep.

3. **Score every end position** — who is winning at the end of each branch?

4. **Pick the move that leads to the best score** — that's the "best move."

The "intelligence" is just doing this extremely fast — millions of positions per second — and pruning bad branches early so it doesn't waste time exploring losing lines.

---

## Key Terms Reference

| Term | Meaning |
|---|---|
| FEN | Text format describing a board position |
| UCI | Text protocol for talking to chess engines |
| Depth | How many moves ahead Stockfish looks |
| Web Worker | Background browser thread (keeps UI responsive) |
| WASM | WebAssembly — compiled C++ that runs in the browser |
| bestmove | Stockfish's reply format e.g. `bestmove e2e4` |
| chess.js | JS library for chess rules and move validation |
| Stockfish | The actual chess AI engine |
