import { useEffect, useState } from "react";
import classNames from "classnames";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import Input from "@gopvp/common/src/components/Input/Input";
import CopyButton from "@gopvp/app/src/components/common/CopyButton";
import CustomLabel from "@gopvp/common/src/components/Label/Label";
import OTPInput from "@gopvp/common/src/components/OtpInput/OtpInput";
import ChipSelect from "@gopvp/common/src/components/ChipSelect/ChipSelect";
import CustomAvatar from "@gopvp/common/src/components/Avatar/Avatar";
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
 pasteText,
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
 rivalText,
 entryText,
 codeText,
 minText,
 roomText,
 vsText,
} from "@gopvp/app/src/constants/message";
import {
 MAX_AMOUNT_DIGITS,
 MS_PER_MINUTE,
} from "@gopvp/app/src/constants/limit";
import { youText } from "@gopvp/common/src/constants/message";
import { icons } from "@gopvp/common/src/components/images";
import {
 ROOM_TABS,
 BET_CHIP_AMOUNTS,
 DURATION_MINUTES,
} from "@gopvp/app/src/constants/option";
import DurationWheel from "@gopvp/app/src/pages/play/DurationWheel";

function roomPlayer(label: string, name: string, side: "me" | "rival") {
 return (
  <Box customClass={classNames("room-face-card", side)}>
   <CustomAvatar
    letter={name.charAt(0).toUpperCase()}
    customClass="room-face-avatar"
   />
   <Box customClass="room-face-meta">
    <Text customClass="room-face-name">{label}</Text>
    <Text customClass="room-face-username">{name}</Text>
   </Box>
  </Box>
 );
}

function roomMeta(label: string, value: string) {
 return (
  <Box customClass="room-meta-item">
   <Text component="span" customClass="room-meta-label">
    {label}
   </Text>
   <Text component="span" customClass="room-meta-value">
    {value}
   </Text>
  </Box>
 );
}

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
 expiryWindowMs,
 onCreateRoom,
 onJoinRoom,
 onStartRoom,
}: IRoomSheetProps) {
 const [roomTab, setRoomTab] = useState<RoomTab>("create");
 const [roomBet, setRoomBet] = useState("");
 const [roomBetError, setRoomBetError] = useState("");
 const [roomMinutes, setRoomMinutes] = useState(String(DURATION_MINUTES[4]));
 const [joinCode, setJoinCode] = useState("");

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
    <Box customClass="matchmaking-searching room-options">
     <Text customClass="dialog-title">
      {isOwner ? opponentJoinedText : waitingForOwnerText}
     </Text>
     {isOwner && (
      <Text customClass="description">{startWhenReadyText}</Text>
     )}
     <Box customClass="room-face-off">
      {roomPlayer(youText, myName, "me")}
      <Text component="span" customClass="room-face-vs">
       {vsText}
      </Text>
      {roomPlayer(rivalText, opponentName, "rival")}
     </Box>
     <Box customClass="room-meta-strip">
      {roomMeta(entryText, formatAmount(roomFee))}
      {roomMeta(
       durationText,
       `${Math.round(roomTimeMs / MS_PER_MINUTE)} ${minText}`,
      )}
      {roomMeta(codeText, roomCode ?? "")}
     </Box>
     {/* <Text customClass="searching-timer">{roomCode}</Text>
     <Text customClass="empty-state-desc description">
      {expiresInText(formatMMSS(expiresInSeconds))}
     </Text> */}
     <Box customClass="pool-confirm-actions">
      <Button
       type="button"
       customClass="cancel-btn room-action-btn"
       disabled={roomStatus === "starting"}
       onClick={onCancel}
      >
       {leaveText}
      </Button>
      {isOwner && (
       <Button
        type="button"
        variant="contained"
        customClass="room-action-btn"
        isLoading={roomStatus === "starting"}
        loaderOnDark
        onClick={onStartRoom}
       >
        {startText}
       </Button>
      )}
     </Box>
    </Box>
   ) : roomStatus === "waiting" ? (
    <Box customClass="matchmaking-searching room-options">
     <Text customClass="dialog-title">{waitingForOpponentText}</Text>
     <Text customClass="description">{shareCodeWithFriendText}</Text>
     <Box customClass="room-code-card">
      <Text component="span" customClass="room-code">
       {roomCode}
      </Text>
      <CopyButton text={roomCode ?? ""} showLabel />
     </Box>
     <Box customClass="room-expiry">
      <icons.timer />
      <Text component="span" customClass="room-expiry-label">
       {expiresText}
      </Text>
      <Text component="span" customClass="room-expiry-time">
       {formatMMSS(expiresInSeconds)}
      </Text>
     </Box>
     <Box customClass="room-expiry-bar">
      <Box
       customClass="room-expiry-fill"
       style={{
        transform: `scaleX(${
         expiryWindowMs > 0
          ? Math.min(1, (expiresInSeconds * 1000) / expiryWindowMs)
          : 0
        })`,
       }}
      />
     </Box>
     <Button
      type="button"
      fullWidth
      customClass="cancel-btn room-action-btn"
      onClick={onCancel}
     >
      {cancelRoomText}
     </Button>
    </Box>
   ) : (
    <Box customClass="matchmaking-searching room-options">
     <Text customClass="sheet-title dialog-title">{roomText}</Text>
     <ChipSelect
      options={ROOM_TABS}
      value={roomTab}
      onChange={setRoomTab}
      label={(t) => (t === "create" ? createRoomText : joinRoomText)}
      customClass="segment compact room-segment"
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
         autoComplete="off"
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
         <Button
          type="button"
          variant="text"
          startIcon="clipboard"
          customClass="room-paste-btn"
          onClick={handlePasteCode}
         >
          {pasteText}
         </Button>
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
