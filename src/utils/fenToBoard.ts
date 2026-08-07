import type { TBoard } from "@/types/types";

const FEN_TO_SYMBOL: Record<string, string> = {
    K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
    k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

export function fenToBoard(fen: string): TBoard {
    const position = fen.split(" ")[0];
    const rows = position.split("/");

    return rows.map((row) => {
        const squares: (string | null)[] = [];
        for (const char of row) {
            if (isNaN(Number(char))) {
                squares.push(FEN_TO_SYMBOL[char] ?? null);
            } else {
                for (let i = 0; i < Number(char); i++) {
                    squares.push(null);
                }
            }
        }
        return squares;
    });
}
