import { useState } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Button from "@gopvp/common/src/components/Button/Button";
// import RoomSheet from "@gopvp/app/src/pages/play/RoomSheet";
// import type { RoomStatus } from "@gopvp/app/src/hooks/useRoomMatch";
import { CircularProgress } from "@mui/material";
import WalletSheetShell from "@gopvp/app/src/components/common/WalletSheetShell";
import WalletSuccessStage from "@gopvp/app/src/components/common/WalletSuccessStage";
import {
 paymentReceivedText,
 withdrawalCompletedText,
} from "@gopvp/app/src/constants/message";
import { WALLET_LOADER_SIZE } from "@gopvp/app/src/constants/limit";

const noop = () => {};
const WALLET_STAGES = ["processing", "deposit", "withdraw"] as const;

export default function Preview() {
 // const [roomStatus, setRoomStatus] = useState<RoomStatus>("waiting");
 // const isJoined = roomStatus === "ready";
 const [stageIndex, setStageIndex] = useState(0);
 const stage = WALLET_STAGES[stageIndex];

 return (
  <Box customClass="preview-page">
   <Button
    type="button"
    variant="outlined"
    fullWidth
    onClick={() => setStageIndex((index) => (index + 1) % WALLET_STAGES.length)}
   >
    {stage}
   </Button>
   <WalletSheetShell open isSuccess={stage !== "processing"} onClose={noop}>
    {stage === "processing" ? (
     <Box customClass="modal-success-stage">
      <Box customClass="modal-success-icon">
       <CircularProgress size={WALLET_LOADER_SIZE} />
      </Box>
     </Box>
    ) : (
     <WalletSuccessStage
      key={stage}
      amountUsd={25}
      title={stage === "deposit" ? paymentReceivedText : withdrawalCompletedText}
     />
    )}
   </WalletSheetShell>
   {/* <Button
    type="button"
    variant="outlined"
    fullWidth
    onClick={() => setRoomStatus(isJoined ? "waiting" : "ready")}
   >
    {isJoined ? "Waiting" : "Joined"}
   </Button>
   <RoomSheet
    open
    onClose={() => setRoomStatus(isJoined ? "waiting" : "ready")}
    onCancel={noop}
    usdValue={100}
    roomStatus={roomStatus}
    isOwner
    roomCode="VNSWEE"
    opponentName={isJoined ? "Ace4402" : ""}
    myName="Tycoon9131"
    roomFee={12}
    roomWin={21.6}
    roomTimeMs={600000}
    expiresInSeconds={0}
    onCreateRoom={noop}
    onJoinRoom={noop}
    onStartRoom={noop}
   /> */}
  </Box>
 );
}
