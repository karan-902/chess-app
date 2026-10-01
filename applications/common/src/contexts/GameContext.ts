import { createContext, useContext } from "react";
import type { IGameContext } from "@gopvp/common/src/types/component";

export const GameContext = createContext<IGameContext>({
 playPath: "/",
 username: "",
 socket: null,
});

export const useGameContext = () => useContext(GameContext);
