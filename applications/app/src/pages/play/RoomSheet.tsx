import { useEffect, useState } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import Input from "@gopvp/common/src/components/Input/Input";
import MatchTicket from "@gopvp/app/src/components/common/MatchTicket";
import OTPInput from "@gopvp/common/src/components/OtpInput/OtpInput";
import ChipSelect from "@gopvp/common/src/components/ChipSelect/ChipSelect";
import { useCopyToClipboard } from "@gopvp/app/src/hooks/useCopyToClipboard";
import { formatAmount, formatMMSS } from "@gopvp/common/src/util/format";
import type { RoomTab } from "@gopvp/common/src/types/component";
import type { IRoomSheetProps } from "@gopvp/app/src/types/component";
import {
 createRoomText,
 joinRoomText,
 feeAmountText,
 feeAmountRequiredText,
 insufficientBalanceText,
 durationText,
 createText,
 roomCodeText,
 pasteCodeText,
 joinText,
 waitingForOpponentText,
 shareCodeWithFriendText,
 opponentJoinedText,
 startWhenReadyText,
 waitingForOwnerText,
 startText,
 leaveText,
 cancelRoomText,
 expiresText,
 entryText,
 timeText,
 codeText,
 minText,
 roomText,
 privateRoomTicketText,
 copiedText,
 copyCodeText,
} from "@gopvp/app/src/constants/message";
import {
 MAX_AMOUNT_DIGITS,
 MS_PER_MINUTE,
 ROOM_CODE_LENGTH,
} from "@gopvp/app/src/constants/limit";
import { icons } from "@gopvp/common/src/components/images";
import {
 ROOM_TABS,
 DURATION_MINUTES,
 DEFAULT_DURATION_MINUTES,
} from "@gopvp/app/src/constants/option";

export default function RoomSheet({
 open,
 onClose,
 onCancel,
 usdValue,
 roomStatus,
 isOwner,
 roomCode,
 opponentName,
 myName,
 roomFee,
 roomTimeMs,
 expiresInSeconds,
 onCreateRoom,
 onJoinRoom,
 onStartRoom,
}: IRoomSheetProps) {
 const [roomTab, setRoomTab] = useState<RoomTab>("create");
 const [roomBet, setRoomBet] = useState("");
 const [roomBetError, setRoomBetError] = useState("");
 const [roomMinutes, setRoomMinutes] = useState(DEFAULT_DURATION_MINUTES);
 const [joinCode, setJoinCode] = useState("");
 const { copied, copy } = useCopyToClipboard();
 const isCodeComplete = joinCode.length === ROOM_CODE_LENGTH;
 const roomMinutesLabel = `${Math.round(roomTimeMs / MS_PER_MINUTE)} ${minText}`;
 const roomTicket = (
  <MatchTicket
   status={roomStatus === "waiting" ? "queued" : "found"}
   title={privateRoomTicketText}
   stats={[
    { label: entryText, value: formatAmount(roomFee) },
    { label: timeText, value: roomMinutesLabel },
    { label: codeText, value: roomCode ?? "" },
   ]}
   tone={1}
   myName={myName}
   opponentName={opponentName}
  />
 );

 useEffect(() => {
  if (!open) return;
  setRoomTab("create");
  setRoomBet("");
  setRoomBetError("");
  setRoomMinutes(DEFAULT_DURATION_MINUTES);
  setJoinCode("");
 }, [open]);

 const handleCreateRoomSubmit = () => {
  const bet = Number(roomBet);
  if (!bet || bet <= 0) {
   setRoomBetError(feeAmountRequiredText);
   return;
  }
  if (bet > usdValue) {
   setRoomBetError(insufficientBalanceText);
   return;
  }
  setRoomBetError("");
  onCreateRoom(bet, Number(roomMinutes) * 60);
 };

 const handleJoinRoomSubmit = () => {
  const code = joinCode.trim();
  if (!code) return;
  onJoinRoom(code);
 };

 const handleCodeChange = (value: string) => {
  const code = value
   .toUpperCase()
   .replace(/[^A-Z0-9]/g, "")
   .slice(0, ROOM_CODE_LENGTH);
  setJoinCode(code);
 };

 const handlePasteCode = async () => {
  try {
   handleCodeChange(await navigator.clipboard.readText());
  } catch (error) {
   console.error(error);
  }
 };

 return (
  <CustomDrawer
   anchor="bottom"
   open={open}
   onClose={onClose}
   customClass="room-sheet"
  >
   {roomStatus === "ready" || roomStatus === "starting" ? (
    <Box customClass="room-options">
     <Box customClass="room-heading">
      <Text customClass="dialog-title">
       {isOwner ? opponentJoinedText : waitingForOwnerText}
      </Text>
      {isOwner && <Text customClass="description">{startWhenReadyText}</Text>}
     </Box>
     {roomTicket}
     {!isOwner && <Box customClass="room-wait-spinner" aria-hidden />}
     <Box customClass="room-actions">
      {isOwner && (
       <Button
        type="button"
        variant="contained"
        fullWidth
        isLoading={roomStatus === "starting"}
        loaderOnDark
        onClick={onStartRoom}
       >
        {startText}
       </Button>
      )}
      <Button
       type="button"
       variant="text"
       customClass="sheet-cancel-link"
       disabled={roomStatus === "starting"}
       onClick={onCancel}
      >
       {leaveText}
      </Button>
     </Box>
    </Box>
   ) : roomStatus === "waiting" ? (
    <Box customClass="room-options">
     <Box customClass="match-head">
      <Box customClass="room-heading">
       <Text customClass="dialog-title">{waitingForOpponentText}</Text>
       <Text customClass="description">{shareCodeWithFriendText}</Text>
      </Box>
     </Box>
     {roomTicket}
     <Text customClass="match-timer" aria-label={expiresText}>
      <icons.timer />
      {formatMMSS(expiresInSeconds)}
     </Text>
     <Box customClass="room-actions">
      <Text
       component="button"
       customClass="match-timer room-code-chip"
       aria-label={copyCodeText}
       onClick={() => copy(roomCode ?? "")}
      >
       <icons.copy />
       {copied ? copiedText : roomCode}
      </Text>
      <Button
       type="button"
       variant="text"
       customClass="sheet-cancel-link"
       onClick={onCancel}
      >
       {cancelRoomText}
      </Button>
     </Box>
    </Box>
   ) : (
    <Box customClass="room-options">
     <Text customClass="dialog-title">{roomText}</Text>
     <ChipSelect
      options={ROOM_TABS}
      value={roomTab}
      onChange={setRoomTab}
      label={(t) => (t === "create" ? createRoomText : joinRoomText)}
      customClass="segment compact gold-bar tabs"
     />
     {roomTab === "create" ? (
      <>
       <Box customClass="room-form">
        <Text component="span" customClass="room-ticket-label">
         {feeAmountText}
        </Text>
        <Box customClass="room-ticket-hero">
         <Input
          id="room-bet"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={MAX_AMOUNT_DIGITS}
          fullWidth
          placeholder="0"
          aria-label={feeAmountText}
          customClass="room-fee-input"
          value={roomBet}
          isError={!!roomBetError}
          onChange={(e) => {
           setRoomBet(
            e.target.value
             .replace(/\D/g, "")
             .replace(/^0+/, "")
             .slice(0, MAX_AMOUNT_DIGITS),
           );
           setRoomBetError("");
          }}
         />
        </Box>
        {roomBetError && (
         <Text customClass="room-ticket-error" role="alert">
          {roomBetError}
         </Text>
        )}
        <Text component="span" customClass="room-ticket-label">
         {durationText}
        </Text>
        <ChipSelect
         options={DURATION_MINUTES}
         value={roomMinutes}
         onChange={setRoomMinutes}
         label={(m) => m}
         subLabel={() => minText}
         customClass="segment gold-bar"
        />
       </Box>
       <Box customClass="room-actions">
        <Button
         type="button"
         variant="contained"
         fullWidth
         disabled={!(Number(roomBet) > 0)}
         isLoading={roomStatus === "creating"}
         loaderOnDark
         onClick={handleCreateRoomSubmit}
        >
         {createText}
        </Button>
       </Box>
      </>
     ) : (
      <>
       <Box customClass="room-form">
        <Text component="span" customClass="room-ticket-label">
         {roomCodeText}
        </Text>
        <OTPInput
         length={ROOM_CODE_LENGTH}
         value={joinCode}
         alphanumeric
         customClass="room-code-otp"
         onChange={handleCodeChange}
        />
        <Button
         type="button"
         variant="text"
         customClass="room-paste-btn"
         onClick={handlePasteCode}
        >
         {pasteCodeText}
        </Button>
       </Box>
       <Box customClass="room-actions">
        <Button
         type="button"
         variant="contained"
         fullWidth
         disabled={!isCodeComplete}
         isLoading={roomStatus === "joining"}
         loaderOnDark
         onClick={handleJoinRoomSubmit}
        >
         {joinText}
        </Button>
       </Box>
      </>
     )}
    </Box>
   )}
  </CustomDrawer>
 );
}
