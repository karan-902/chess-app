import { useState } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Button from "@gopvp/common/src/components/Button/Button";
import RoomSheet from "@gopvp/app/src/pages/play/RoomSheet";
import type { RoomStatus } from "@gopvp/app/src/hooks/useRoomMatch";const noop = () => {};

export default function Preview() {
 const [roomStatus, setRoomStatus] = useState<RoomStatus>("waiting");
 const isJoined = roomStatus === "ready";

 return (
  <Box customClass="preview-page">
   <Button
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
    roomTimeMs={600000}
    expiresInSeconds={0}
    onCreateRoom={noop}
    onJoinRoom={noop}
    onStartRoom={noop}
   />
  </Box>
 );
}
