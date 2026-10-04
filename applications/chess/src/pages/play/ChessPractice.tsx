import { useNavigate } from "react-router-dom";
import { useGameContext } from "@gopvp/common/src/contexts/GameContext";
import PracticeSheet from "@gopvp/chess/src/pages/play/PracticeSheet";
import { useChessDispatch } from "@gopvp/chess/src/redux/chessHooks";
import { startPvcGame } from "@gopvp/chess/src/redux/pvc/slice";
import type { IGamePracticeProps } from "@gopvp/common/src/types/component";
import type { Difficulty } from "@gopvp/chess/src/types/component";
import type { GameCategory } from "@gopvp/chess/src/types/index";

export default function ChessPractice({
 open,
 onClose,
}: IGamePracticeProps) {
 const navigate = useNavigate();
 const dispatch = useChessDispatch();
 const { playPath, username } = useGameContext();

 const handlePlay = (difficulty: Difficulty, timeControl: GameCategory) => {
  const gameId = `pvc_${Date.now()}`;
  onClose();
  dispatch(
   startPvcGame({
    gameId,
    difficulty,
    category: timeControl,
    color: Math.random() < 0.5 ? "w" : "b",
    username,
   }),
  );
  navigate(`${playPath}?practice_id=${gameId}`, { replace: true });
 };

 return (
  <PracticeSheet
   open={open}
   onClose={onClose}
   onPlay={handlePlay}
  />
 );
}
