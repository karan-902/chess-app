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

export interface IPieceMotion {
 x: number;
 y: number;
 opacity: number;
 scaleX: number;
 scaleY: number;
 rotate: number;
}

export interface IFxMotion {
 x: number;
 y: number;
 scale: number;
 opacity: number;
}
