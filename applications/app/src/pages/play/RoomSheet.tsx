import { useEffect, useState } from "react";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import Input from "@gopvp/common/src/components/Input/Input";
import CustomLabel from "@gopvp/common/src/components/Label/Label";
import OTPInput from "@gopvp/common/src/components/OtpInput/OtpInput";
import ChipSelect from "@gopvp/common/src/components/ChipSelect/ChipSelect";
import { formatMMSS } from "@gopvp/common/src/util/format";
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
 pasteText,
 joinText,
 waitingForOpponentText,
 shareCodeWithFriendText,
 opponentJoinedText,
 waitingForOwnerText,
 startText,
 leaveText,
 expiresInText,
 copyCodeText,
 copiedExclaimText,
 roomText,
} from "@gopvp/app/src/constants/message";
import { MAX_AMOUNT_DIGITS } from "@gopvp/app/src/constants/limit";
import { cancelText } from "@gopvp/common/src/constants/message";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import {
 ROOM_TABS,
 BET_CHIP_AMOUNTS,
 DURATION_MINUTES,
} from "@gopvp/app/src/constants/option";
import SheetActions from "@gopvp/common/src/components/SheetActions/SheetActions";
import DurationWheel from "@gopvp/app/src/pages/play/DurationWheel";

export default function RoomSheet({
 open,
 onClose,
 onCancel,
 usdValue,
 roomStatus,
 isOwner,
 roomCode,
 expiresInSeconds,
 onCreateRoom,
 onJoinRoom,
 onStartRoom,
}: IRoomSheetProps) {
 const [roomTab, setRoomTab] = useState<RoomTab>("create");
 const [roomBet, setRoomBet] = useState("");
 const [roomBetError, setRoomBetError] = useState("");
 const [roomMinutes, setRoomMinutes] = useState(String(DURATION_MINUTES[4]));
 const [joinCode, setJoinCode] = useState("");
 const [codeCopied, setCodeCopied] = useState(false);

 useEffect(() => {
  if (!open) return;
  setRoomTab("create");
  setRoomBet("");
  setRoomBetError("");
  setRoomMinutes(String(DURATION_MINUTES[4]));
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
  const minutes = Number(roomMinutes);
  if (!minutes || minutes <= 0) return;
  onCreateRoom(bet, Math.round(minutes * 60));
 };

 const handleJoinRoomSubmit = () => {
  const code = joinCode.trim();
  if (!code) return;
  onJoinRoom(code);
 };

 const handleCopyCode = () => {
  if (!roomCode) return;
  navigator.clipboard.writeText(roomCode);
  setCodeCopied(true);
  setTimeout(() => setCodeCopied(false), 1500);
 };

 const handlePasteCode = async () => {
  try {
   const text = await navigator.clipboard.readText();
   setJoinCode(
    text
     .toUpperCase()
     .replace(/[^A-Z0-9]/g, "")
     .slice(0, 6),
   );
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
    <Box customClass="matchmaking-searching">
     <Text customClass="dialog-title">
      {isOwner ? opponentJoinedText : waitingForOwnerText}
     </Text>
     <Text customClass="searching-timer">{roomCode}</Text>
     {isOwner ? (
      <SheetActions>
       <Button
        type="button"
        variant="contained"
        fullWidth
        customClass="game-cta"
        isLoading={roomStatus === "starting"}
        loaderOnDark
        onClick={onStartRoom}
       >
        {startText}
       </Button>
      </SheetActions>
     ) : (
      <SheetActions cancelLabel={leaveText} onCancel={onCancel} />
     )}
    </Box>
   ) : roomStatus === "waiting" ? (
    <Box customClass="matchmaking-searching">
     <Text customClass="dialog-title">{waitingForOpponentText}</Text>
     <Text customClass="empty-state-desc description">
      {shareCodeWithFriendText}
     </Text>
     <Text customClass="searching-timer">{roomCode}</Text>
     <Text customClass="empty-state-desc description">
      {expiresInText(formatMMSS(expiresInSeconds))}
     </Text>
     <Button
      type="button"
      variant="outlined"
      fullWidth
      customClass="common-play cancel-btn"
      startIcon={codeCopied ? "check" : "copy"}
      onClick={handleCopyCode}
     >
      {codeCopied ? copiedExclaimText : copyCodeText}
     </Button>
     <SheetActions cancelLabel={cancelText} onCancel={onCancel} />
    </Box>
   ) : (
    <Box customClass="matchmaking-searching room-options">
     <Text customClass="sheet-title dialog-title">{roomText}</Text>
     <ChipSelect
      options={ROOM_TABS}
      value={roomTab}
      onChange={setRoomTab}
      label={(t) => (t === "create" ? createRoomText : joinRoomText)}
      customClass="segment compact"
     />
     {roomTab === "create" ? (
      <>
       <Box customClass="room-field room-bet-field">
        <CustomLabel
         htmlFor="room-bet"
         customClass="room-field-label room-bet-label"
        >
         {feeAmountText}
        </CustomLabel>
        <Input
         id="room-bet"
         type="text"
         inputMode="numeric"
         slotProps={{
          input: {
           maxLength: MAX_AMOUNT_DIGITS,
          },
         }}
         fullWidth
         placeholder="0.00"
         customClass="amount-input-hero"
         value={roomBet}
         isError={!!roomBetError}
         helperText={roomBetError}
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
        <Box customClass="tx-filter-chip-grid room-bet-chips">
         {BET_CHIP_AMOUNTS.map((amount) => (
          <Button
           key={amount}
           type="button"
           customClass={classNames(
            "tx-filter-chip",
            roomBet === String(amount) && "active",
           )}
           onClick={() => {
            setRoomBet(String(amount));
            setRoomBetError("");
           }}
          >
           ${amount}
          </Button>
         ))}
        </Box>
       </Box>

       <Box customClass="room-field room-duration-field">
        <CustomLabel customClass="room-field-label room-bet-label">
         {durationText}
        </CustomLabel>
        <DurationWheel
         value={Number(roomMinutes)}
         onChange={(minutes) => setRoomMinutes(String(minutes))}
        />
       </Box>

       <Box customClass="create-room-button-wrap">
        <Button
         type="button"
         variant="contained"
         fullWidth
         customClass="game-cta create-room-btn"
         disabled={!(Number(roomBet) > 0) || !(Number(roomMinutes) > 0)}
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
       <Box customClass="room-field">
        <Box customClass="room-field-head">
         <CustomLabel customClass="room-field-label">
          {roomCodeText}
         </CustomLabel>
         <CustomIconButton
          customClass="room-paste-btn"
          onClick={handlePasteCode}
          aria-label={pasteText}
          icon="contentPaste"
         />
        </Box>
        <OTPInput
         length={6}
         value={joinCode}
         alphanumeric
         onChange={(v) =>
          setJoinCode(v.toUpperCase().replace(/[^A-Z0-9]/g, ""))
         }
        />
       </Box>
       <Button
        type="button"
        variant="contained"
        fullWidth
        customClass="game-cta join-room-btn"
        disabled={joinCode.length !== 6}
        isLoading={roomStatus === "joining"}
        loaderOnDark
        onClick={handleJoinRoomSubmit}
       >
        {joinText}
       </Button>
      </>
     )}
    </Box>
   )}
  </CustomDrawer>
 );
}
