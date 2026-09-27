import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import BetSheet from "@gopvp/chess/src/pages/play/BetSheet";
import RoomSheet from "@gopvp/chess/src/pages/play/RoomSheet";
import PoolConfirmSheet from "@gopvp/chess/src/pages/play/PoolConfirmSheet";
import { usePools } from "@gopvp/chess/src/hooks/usePools";
import { useMatchmaking } from "@gopvp/chess/src/hooks/useMatchmaking";
import { useRoomMatch } from "@gopvp/chess/src/hooks/useRoomMatch";
import { useWalletBalance } from "@gopvp/chess/src/hooks/useWallet";
import { useGame } from "@gopvp/chess/src/hooks/useGame";
import type { IPoolResponse } from "@gopvp/common/src/types/response";
import type { IPlayPageProps } from "@gopvp/common/src/types/component";
import { tapPlayNowHintText, playNowText } from "@gopvp/chess/src/constants/messages";

export default function PlayPage({
 gameModule: { Preview, PoolLabel, GameRoom, Practice },
}: IPlayPageProps) {
 const [sheetOpen, setSheetOpen] = useState(false);
 const [searchParams] = useSearchParams();
 const navigate = useNavigate();
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

 if (matchId || gameId) {
  return (
   <Suspense
    fallback={
     <Box customClass="modal-loader">
      <CircularProgress size={28} />
     </Box>
    }
   >
    <GameRoom />
   </Suspense>
  );
 }

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
     <Suspense fallback={null}>
      <Preview />
     </Suspense>
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
    PoolLabel={PoolLabel}
    onPoolPlay={handlePoolPlay}
    onPracticeOpen={Practice && handlePracticeOpen}
    onRoomOpen={handleRoomOpen}
    onInsufficientBalance={() => navigate("/wallet")}
   />

   {Practice && (
    <Suspense fallback={null}>
     <Practice
      open={practiceOpen}
      onClose={() => setPracticeOpen(false)}
      onCancel={handlePracticeCancel}
     />
    </Suspense>
   )}

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
