import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import BoardPreview from "@gopvp/chess/src/components/board/BoardPreview";
import GameRoom from "@gopvp/chess/src/pages/play/GameRoom";
import MatchLoader from "@gopvp/chess/src/pages/play/MatchLoader";
import BetSheet from "@gopvp/chess/src/pages/play/BetSheet";
import PracticeSheet from "@gopvp/chess/src/pages/play/PracticeSheet";
import RoomSheet from "@gopvp/chess/src/pages/play/RoomSheet";
import PoolConfirmSheet from "@gopvp/chess/src/pages/play/PoolConfirmSheet";
import { usePools } from "@gopvp/chess/src/hooks/usePools";
import { useMatchmaking } from "@gopvp/chess/src/hooks/useMatchmaking";
import { useRoomMatch } from "@gopvp/chess/src/hooks/useRoomMatch";
import { useWalletBalance } from "@gopvp/chess/src/hooks/useWallet";
import { useGame } from "@gopvp/chess/src/hooks/useGame";
import { useReduxDispatch, useReduxSelector } from "@gopvp/chess/src/redux/hooks";
import { startPvcGame } from "@gopvp/chess/src/redux/pvc/slice";
import type { IPoolResponse } from "@gopvp/common/src/types/response";
import type { Difficulty } from "@gopvp/chess/src/types/component";
import type { GameCategory } from "@gopvp/chess/src/types/index";
import { tapPlayNowHintText, playNowText } from "@gopvp/chess/src/constants/messages";

export default function PlayPage() {
 const [sheetOpen, setSheetOpen] = useState(false);
 const [searchParams] = useSearchParams();
 const navigate = useNavigate();
 const dispatch = useReduxDispatch();
 const username = useReduxSelector((state) => state.auth.session?.username);
 const pvcGameId = useReduxSelector((state) => state.pvc.gameId);
 const { routes } = useGame();
 const { pools, loading: poolsLoading } = usePools();
 const { usdValue } = useWalletBalance();
 const {
  status,
  queuedPool,
  secondsLeft,
  joinQueue,
  leaveQueue,
  resetStatus,
 } = useMatchmaking();
 const gameId = searchParams.get("game_id");
 const matchId = searchParams.get("match");
 const [confirmOpen, setConfirmOpen] = useState(false);
 const [confirmPool, setConfirmPool] = useState<IPoolResponse | null>(null);
 const [practiceOpen, setPracticeOpen] = useState(false);
 const [roomOpen, setRoomOpen] = useState(false);

 const {
  status: roomStatus,
  isOwner,
  roomCode,
  expiresInSeconds,
  createRoom,
  joinRoom,
  startRoom,
  cancelRoom,
  resetStatus: resetRoomStatus,
 } = useRoomMatch(() => {
  setRoomOpen(false);
  navigate(routes.PLAY, { replace: true });
 });

 useEffect(() => {
  if (status !== "found") return;
  setSheetOpen(false);
  setConfirmOpen(false);
  if (!gameId && !matchId) resetStatus();
 }, [status, gameId, matchId, resetStatus]);

 useEffect(() => {
  if (status === "idle") {
   setConfirmOpen(false);
   setConfirmPool(null);
  }
 }, [status]);

 useEffect(() => {
  if (roomStatus !== "found") return;
  setRoomOpen(false);
 }, [roomStatus]);

 if (matchId) {
  return <MatchLoader matchId={matchId} />;
 }

 if (gameId) {
  return gameId === pvcGameId ? (
   <GameRoom mode="pvc" />
  ) : (
   <Navigate to={routes.PLAY} replace />
  );
 }

 const handlePractice = (difficulty: Difficulty, timeControl: GameCategory) => {
  setPracticeOpen(false);
  const gameId = `pvc-${Date.now()}`;
  dispatch(
   startPvcGame({
    gameId,
    difficulty,
    category: timeControl,
    color: Math.random() < 0.5 ? "w" : "b",
    username: username ?? "",
   }),
  );
  navigate(`${routes.PLAY}?game_id=${gameId}`, { replace: true });
 };

 const handlePracticeOpen = () => {
  setSheetOpen(false);
  setPracticeOpen(true);
 };

 const handlePracticeCancel = () => {
  setPracticeOpen(false);
  setSheetOpen(true);
 };

 const handleRoomOpen = () => {
  setSheetOpen(false);
  resetRoomStatus();
  setRoomOpen(true);
 };

 const handleRoomClose = () => {
  if (roomStatus === "waiting" || roomStatus === "ready") cancelRoom();
  setRoomOpen(false);
 };

 const handleRoomCancel = () => {
  cancelRoom();
  setRoomOpen(false);
  setSheetOpen(true);
 };

 const handlePoolPlay = (pool: IPoolResponse) => {
  setSheetOpen(false);
  setConfirmPool(pool);
  setConfirmOpen(true);
 };

 const handleConfirmJoin = () => {
  if (!confirmPool) return;
  joinQueue(confirmPool);
 };

 const handleConfirmCancel = () => {
  setConfirmOpen(false);
  setConfirmPool(null);
  setSheetOpen(true);
 };

 const handleConfirmClose = () => {
  if (status === "joining" || status === "queued") leaveQueue();
  setConfirmOpen(false);
  setConfirmPool(null);
 };

 return (
  <Box customClass="play-page">
   <Box customClass="play-body">
    <Box customClass="board-wrap">
     <BoardPreview />
    </Box>
    <Text customClass="play-hint description">{tapPlayNowHintText}</Text>
   </Box>

   <Box customClass="cta-bottom">
    <Button
     type="button"
     variant="contained"
     fullWidth
     customClass="game-cta play-cta"
     onClick={() => setSheetOpen(true)}
    >
     {playNowText}
    </Button>
   </Box>

   <BetSheet
    open={sheetOpen}
    onClose={() => setSheetOpen(false)}
    pools={pools}
    poolsLoading={poolsLoading}
    usdValue={usdValue}
    onPoolPlay={handlePoolPlay}
    onPracticeOpen={handlePracticeOpen}
    onRoomOpen={handleRoomOpen}
    onInsufficientBalance={() => navigate("/wallet")}
   />

   <PracticeSheet
    open={practiceOpen}
    onClose={() => setPracticeOpen(false)}
    onCancel={handlePracticeCancel}
    onPlay={handlePractice}
   />

   <RoomSheet
    open={roomOpen}
    onClose={handleRoomClose}
    onCancel={handleRoomCancel}
    usdValue={usdValue}
    roomStatus={roomStatus}
    isOwner={isOwner}
    roomCode={roomCode}
    expiresInSeconds={expiresInSeconds}
    onCreateRoom={createRoom}
    onJoinRoom={joinRoom}
    onStartRoom={startRoom}
   />

   <PoolConfirmSheet
    open={confirmOpen}
    onClose={handleConfirmClose}
    status={status}
    queuedPool={queuedPool}
    confirmPool={confirmPool}
    secondsLeft={secondsLeft}
    onLeaveQueue={leaveQueue}
    onConfirmJoin={handleConfirmJoin}
    onConfirmCancel={handleConfirmCancel}
   />
  </Box>
 );
}
