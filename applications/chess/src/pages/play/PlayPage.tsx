import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Navigate } from "react-router-dom";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import BoardPreview from "@/components/board/BoardPreview";
import GameRoom from "./GameRoom";
import MatchLoader from "./MatchLoader";
import BetSheet from "./BetSheet";
import PracticeSheet from "./PracticeSheet";
import RoomSheet from "./RoomSheet";
import PoolConfirmSheet from "./PoolConfirmSheet";
import { usePools } from "@/hooks/usePools";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { useRoomMatch } from "@/hooks/useRoomMatch";
import { useWalletBalance } from "@/hooks/useWallet";
import { useGame } from "@/hooks/useGame";
import { useReduxDispatch, useReduxSelector } from "@/redux/hooks";
import { startPvcGame } from "@/redux/pvc/slice";
import type { IPoolResponse } from "@gopvp/common/src/types/response";
import type { Difficulty } from "@/types/component";
import type { GameCategory } from "@/types/index";
import { tapPlayNowHintText, playNowText } from "@/constants/messages";

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
