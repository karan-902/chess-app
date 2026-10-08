import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import Skeleton from "@gopvp/common/src/components/Skeleton/Skeleton";
import { icons } from "@gopvp/common/src/components/images";
import BetSheet from "@gopvp/app/src/pages/play/BetSheet";
import RoomSheet from "@gopvp/app/src/pages/play/RoomSheet";
import PoolConfirmSheet from "@gopvp/app/src/pages/play/PoolConfirmSheet";
import { usePools } from "@gopvp/app/src/hooks/usePools";
import { useMatchmaking } from "@gopvp/app/src/hooks/useMatchmaking";
import { useRoomMatch } from "@gopvp/app/src/hooks/useRoomMatch";
import { useWalletBalance } from "@gopvp/app/src/hooks/useWallet";
import { useGame } from "@gopvp/app/src/hooks/useGame";
import type { IPoolResponse } from "@gopvp/common/src/types/response";
import {
 tapPlayNowHintText,
 playNowText,
} from "@gopvp/app/src/constants/message";
import { ROUTES } from "@gopvp/app/src/constants/route";

export default function PlayPage() {
 const [sheetOpen, setSheetOpen] = useState(false);
 const [searchParams] = useSearchParams();
 const navigate = useNavigate();
 const {
  gamePath,
  gameModule: { Preview, PoolLabel, GameRoom, preloadGameRoom, Practice },
 } = useGame();
 const { pools, loading: poolsLoading } = usePools();
 const { usdValue, loading: balanceLoading } = useWalletBalance();
 const { status, queuedPool, secondsLeft, joinQueue, leaveQueue, resetStatus } =
  useMatchmaking();
 const gameId = searchParams.get("practice_id");
 const matchId = searchParams.get("match_id");
 const [confirmOpen, setConfirmOpen] = useState(false);
 const [confirmPool, setConfirmPool] = useState<IPoolResponse | null>(null);
 const [practiceOpen, setPracticeOpen] = useState(false);
 const [roomOpen, setRoomOpen] = useState(false);

 const {
  status: roomStatus,
  isOwner,
  roomCode,
  opponentName,
  expiresInSeconds,
  createRoom,
  joinRoom,
  startRoom,
  cancelRoom,
  resetStatus: resetRoomStatus,
 } = useRoomMatch(() => {
  setRoomOpen(false);
  navigate(gamePath, { replace: true });
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

 useEffect(() => {
  if (status === "queued" || roomOpen) preloadGameRoom();
 }, [status, roomOpen, preloadGameRoom]);

 if (matchId || gameId) {
  return (
   <Suspense
    fallback={
     <Box customClass="modal-loader game-loader">
      <Box customClass="logo-loader" role="progressbar" />
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

 const handleRoomOpen = () => {
  setSheetOpen(false);
  resetRoomStatus();
  setRoomOpen(true);
 };

 const handleRoomClose = () => {
  if (roomStatus !== "starting") cancelRoom();
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
     <Suspense
      fallback={<Skeleton variant="rounded" customClass="board-skeleton" />}
     >
      <Preview />
     </Suspense>
    </Box>
   </Box>

   <Box customClass="cta-bottom">
    <Text customClass="play-hint">
     {tapPlayNowHintText}
     <icons.chevronDown />
    </Text>
    <Button
     type="button"
     variant="contained"
     fullWidth
     elevated
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
    poolsLoading={poolsLoading || balanceLoading}
    usdValue={usdValue}
    PoolLabel={PoolLabel}
    onPoolPlay={handlePoolPlay}
    onPracticeOpen={Practice && handlePracticeOpen}
    onRoomOpen={handleRoomOpen}
    onInsufficientBalance={() => navigate(ROUTES.WALLET)}
   />

   {Practice && (
    <Suspense fallback={null}>
     <Practice
      open={practiceOpen}
      onClose={() => setPracticeOpen(false)}
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
    opponentName={opponentName}
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
