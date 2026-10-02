import { useState, useCallback } from "react";
import { Chess } from "chess.js";
import type { Move, Square } from "chess.js";
import type { MoveRecord } from "@gopvp/chess/src/types/index";
import type { IMovePlayed } from "@gopvp/chess/src/types/response";
import { playSound, getMoveSound } from "@gopvp/chess/src/lib/sounds";
import {
 CAPTURE_ORDER,
 STARTING_COUNTS,
 PIECE_VALUES,
 FILES,
 KNIGHT_STEPS,
 DIAGONAL_STEPS,
 ORTHOGONAL_STEPS,
} from "@gopvp/chess/src/constants/board";

const positionKey = (fen: string) => fen.split(" ").slice(0, 4).join(" ");

const toMoveRecords = (moves: Move[]): MoveRecord[] => {
 if (moves.length === 0) return [];
 const [, turn, , , , fullMove] = moves[0].before.split(" ");
 const sans = moves.map((move) => move.san);
 const paired = turn === "b" ? ["", ...sans] : sans;
 const records: MoveRecord[] = [];
 for (let i = 0; i < paired.length; i += 2) {
  records.push({
   n: Number(fullMove) + i / 2,
   w: paired[i],
   b: paired[i + 1] ?? "",
  });
 }
 return records;
};

export interface ICapturedPieces {
 byWhite: string[];
 byBlack: string[];
 whiteAdvantage: number;
}

export function useChessGame() {
 const [chess] = useState(() => new Chess());
 const [fen, setFen] = useState(() => chess.fen());
 const [fenHistory, setFenHistory] = useState<string[]>([chess.fen()]);
 const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
 const [lastMove, setLastMove] = useState<{
  from: string;
  to: string;
 } | null>(null);
 const [moveLog, setMoveLog] = useState<
  Array<{ from: string; to: string; promotion: string | null }>
 >([]);

 const makeMove = useCallback(
  (
   from: string,
   to: string,
   promotion = "q",
  ): { fen: string; promotion?: string } | null => {
   try {
    const move = chess.move({ from, to, promotion });
    if (move) {
     playSound(getMoveSound(move, chess.isCheck(), chess.isGameOver()));
     setLastMove({ from, to });
     const newFen = chess.fen();
     setFen(newFen);
     setFenHistory((prev) => [...prev, newFen]);
     setMoveHistory(toMoveRecords(chess.history({ verbose: true })));
     setMoveLog((prev) => [
      ...prev,
      { from, to, promotion: move.promotion ?? null },
     ]);
     return { fen: newFen, promotion: move.promotion };
    }
    return null;
   } catch {
    return null;
   }
  },
  [chess],
 );

 const restoreGame = useCallback(
  (moves: Array<{ from: string; to: string; promotion: string | null }>) => {
   chess.reset();
   const fenHist = [chess.fen()];
   for (const m of moves) {
    chess.move({
     from: m.from,
     to: m.to,
     promotion: m.promotion ?? "q",
    });
    fenHist.push(chess.fen());
   }
   setFen(chess.fen());
   setFenHistory(fenHist);
   setMoveHistory(toMoveRecords(chess.history({ verbose: true })));
   setMoveLog(moves);
   if (moves.length > 0) {
    const last = moves[moves.length - 1];
    setLastMove({ from: last.from, to: last.to });
   }
  },
  [chess],
 );

 const loadFen = useCallback(
  (serverFen: string) => {
   chess.load(serverFen);
   const loadedFen = chess.fen();
   setFen(loadedFen);
   setFenHistory([loadedFen]);
   setMoveHistory([]);
   setMoveLog([]);
   setLastMove(null);
  },
  [chess],
 );

 const getLegalMoves = useCallback(
  (square: string): string[] => {
   const moves = chess.moves({
    square: square as Square,
    verbose: true,
   });
   return moves.map((m) => m.to);
  },
  [chess],
 );

 const isPromotionMove = useCallback(
  (from: string, to: string): boolean => {
   const moves = chess.moves({
    square: from as Square,
    verbose: true,
   });
   return moves.some((m) => m.to === to && m.promotion !== undefined);
  },
  [chess],
 );

 const getAttackedSquares = useCallback((): string[] => {
  const board = chess.board();
  const currentColor = chess.turn();
  const opponentColor = currentColor === "w" ? "b" : "w";
  const attacked: string[] = [];

  board.forEach((row) => {
   row.forEach((cell) => {
    if (cell && cell.color === currentColor) {
     if (chess.isAttacked(cell.square, opponentColor)) {
      attacked.push(cell.square);
     }
    }
   });
  });

  return attacked;
 }, [chess]);

 const getCapturedPieces = useCallback((): ICapturedPieces => {
  const board = chess.board();
  const remaining: Record<"w" | "b", Record<string, number>> = {
   w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
   b: { p: 0, n: 0, b: 0, r: 0, q: 0 },
  };
  board.forEach((row) =>
   row.forEach((cell) => {
    if (cell && cell.type !== "k") remaining[cell.color][cell.type]++;
   }),
  );

  const byWhite: string[] = [];
  const byBlack: string[] = [];
  for (const type of CAPTURE_ORDER) {
   const blackMissing = STARTING_COUNTS[type] - remaining.b[type];
   const whiteMissing = STARTING_COUNTS[type] - remaining.w[type];
   for (let i = 0; i < blackMissing; i++) byWhite.push(type);
   for (let i = 0; i < whiteMissing; i++) byBlack.push(type);
  }

  const materialWhite = byWhite.reduce((sum, t) => sum + PIECE_VALUES[t], 0);
  const materialBlack = byBlack.reduce((sum, t) => sum + PIECE_VALUES[t], 0);

  return {
   byWhite,
   byBlack,
   whiteAdvantage: materialWhite - materialBlack,
  };
 }, [chess]);

 const getPieceColor = useCallback(
  (square: string): "w" | "b" | null => {
   return chess.get(square as Square)?.color ?? null;
  },
  [chess],
 );

 type PremoveEntry = { from: string; to: string };
 type BoardPiece = { type: string; color: "w" | "b" };

 const simulatePremoves = useCallback(
  (priorMoves: PremoveEntry[]) => {
   const board = new Map<string, BoardPiece>();
   for (const row of new Chess(fen).board()) {
    for (const cell of row) {
     if (cell) board.set(cell.square, { type: cell.type, color: cell.color });
    }
   }
   for (const { from, to } of priorMoves) {
    const piece = board.get(from);
    if (!piece) continue;
    board.delete(from);
    const promotes = piece.type === "p" && (to[1] === "8" || to[1] === "1");
    board.set(to, promotes ? { ...piece, type: "q" } : piece);
    const fileShift = FILES.indexOf(to[0]) - FILES.indexOf(from[0]);
    if (piece.type === "k" && Math.abs(fileShift) === 2) {
     const rookFrom = `${fileShift > 0 ? "h" : "a"}${from[1]}`;
     const rook = board.get(rookFrom);
     board.delete(rookFrom);
     if (rook) board.set(`${fileShift > 0 ? "f" : "d"}${from[1]}`, rook);
    }
   }
   return board;
  },
  [fen],
 );

 const getPremoveMoves = useCallback(
  (
   square: string,
   asColor: "w" | "b",
   priorMoves: PremoveEntry[] = [],
  ): string[] => {
   const board = simulatePremoves(priorMoves);
   const piece = board.get(square);
   if (!piece || piece.color !== asColor) return [];

   const file = FILES.indexOf(square[0]);
   const rank = Number(square[1]);
   const targets: string[] = [];
   const add = (fileStep: number, rankStep: number) => {
    const nextFile = file + fileStep;
    const nextRank = rank + rankStep;
    if (nextFile >= 0 && nextFile < 8 && nextRank >= 1 && nextRank <= 8) {
     targets.push(`${FILES[nextFile]}${nextRank}`);
    }
   };
   const isOwnPiece = (target: string) => board.get(target)?.color === asColor;
   const slide = (steps: number[][]) =>
    steps.forEach(([fileStep, rankStep]) => {
     for (let distance = 1; distance < 8; distance++) {
      const nextFile = file + fileStep * distance;
      const nextRank = rank + rankStep * distance;
      const target = `${FILES[nextFile]}${nextRank}`;
      if (nextFile < 0 || nextFile > 7 || nextRank < 1 || nextRank > 8) break;
      if (isOwnPiece(target)) break;
      targets.push(target);
     }
    });
   const kingSteps = [...DIAGONAL_STEPS, ...ORTHOGONAL_STEPS];

   switch (piece.type) {
    case "p": {
     const forward = asColor === "w" ? 1 : -1;
     add(0, forward);
     if (
      rank === (asColor === "w" ? 2 : 7) &&
      !isOwnPiece(`${square[0]}${rank + forward}`)
     )
      add(0, forward * 2);
     add(-1, forward);
     add(1, forward);
     break;
    }
    case "n":
     KNIGHT_STEPS.forEach(([fileStep, rankStep]) => add(fileStep, rankStep));
     break;
    case "b":
     slide(DIAGONAL_STEPS);
     break;
    case "r":
     slide(ORTHOGONAL_STEPS);
     break;
    case "q":
     slide(kingSteps);
     break;
    case "k": {
     kingSteps.forEach(([fileStep, rankStep]) => add(fileStep, rankStep));
     const homeRank = asColor === "w" ? 1 : 8;
     if (square !== `e${homeRank}`) break;
     const hasRook = (rookSquare: string) =>
      board.get(rookSquare)?.type === "r" &&
      board.get(rookSquare)?.color === asColor;
     const isPathClear = (files: string) =>
      [...files].every((pathFile) => !isOwnPiece(`${pathFile}${homeRank}`));
     if (hasRook(`h${homeRank}`) && isPathClear("fg"))
      targets.push(`g${homeRank}`);
     if (hasRook(`a${homeRank}`) && isPathClear("bcd"))
      targets.push(`c${homeRank}`);
     break;
    }
   }
   return targets.filter((target) => board.get(target)?.color !== asColor);
  },
  [simulatePremoves],
 );

 const getPremovePieceColor = useCallback(
  (square: string, priorMoves: PremoveEntry[] = []): "w" | "b" | null =>
   simulatePremoves(priorMoves).get(square)?.color ?? null,
  [simulatePremoves],
 );

 const getRandomMove = useCallback((): {
  from: string;
  to: string;
 } | null => {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;
  const m = moves[Math.floor(Math.random() * moves.length)];
  return { from: m.from, to: m.to };
 }, [chess]);

 const applyServerFen = useCallback(
  (serverFen: string, played?: IMovePlayed): boolean => {
   const target = positionKey(serverFen);
   if (positionKey(chess.fen()) === target) return true;
   if (played?.from && played.to) {
    return (
     !!makeMove(played.from, played.to, played.promotion ?? undefined) &&
     positionKey(chess.fen()) === target
    );
   }
   const move = chess
    .moves({ verbose: true })
    .find((m) => positionKey(m.after) === target);
   return !!move && !!makeMove(move.from, move.to, move.promotion);
  },
  [chess, makeMove],
 );

 const resetGame = useCallback(() => {
  chess.reset();
  const startFen = chess.fen();
  setFen(startFen);
  setFenHistory([startFen]);
  setMoveHistory([]);
  setLastMove(null);
  setMoveLog([]);
 }, [chess]);

 const isGameOver = chess.isGameOver();
 const isCheckmate = chess.isCheckmate();
 const isStalemate = chess.isStalemate();
 const isDraw = chess.isDraw();
 const turn = chess.turn();
 const inCheck = chess.isCheck();

 const kingSquare = useCallback((): string | null => {
  const board = chess.board();
  for (const row of board) {
   for (const cell of row) {
    if (cell && cell.type === "k" && cell.color === turn) {
     return cell.square;
    }
   }
  }
  return null;
 }, [chess, turn]);

 return {
  fen,
  fenHistory,
  makeMove,
  applyServerFen,
  loadFen,
  resetGame,
  restoreGame,
  getLegalMoves,
  isPromotionMove,
  getRandomMove,
  getPieceColor,
  getPremoveMoves,
  getPremovePieceColor,
  getAttackedSquares,
  getCapturedPieces,
  moveHistory,
  moveLog,
  lastMove,
  isGameOver,
  isCheckmate,
  isStalemate,
  isDraw,
  turn,
  inCheck,
  kingSquare,
 };
}
