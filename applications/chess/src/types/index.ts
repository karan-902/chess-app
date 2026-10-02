export type GameCategory = "BULLET" | "BLITZ" | "RAPID" | "CLASSICAL";
export type PieceColor = "w" | "b";

export type IGameRoomPlayer = {
 name: string;
 scoreLabel: string;
 color: PieceColor;
};

export interface MoveRecord {
 n: number;
 w: string;
 b: string;
}
