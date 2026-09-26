import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Box from "@/components/base/Box/Box";
import Text from "@/components/base/Text/Text";
import Button from "@/components/base/Button/Button";
import CustomDrawer from "@/components/base/Drawer/Drawer";
import CustomSwitch from "@/components/base/Switch/Switch";
import Input from "@/components/base/Input/Input";
import CustomLabel from "@/components/base/Label/Label";
import OTPInput from "@/components/base/OtpInput/OtpInput";
import ChipSelect from "@/components/common/ChipSelect";
import { formatMMSS } from "@/utils";
import type {
 IDurationWheelProps,
 IRoomSheetProps,
 RoomTab,
} from "@/types/components";
import {
 roomCreateTabLabel,
 roomJoinTabLabel,
 roomBetLabel,
 roomBetRequired,
 roomBetInsufficientBalance,
 roomTimeLabel,
 roomMinutesSuffix,
 roomRatedLabel,
 roomCreateButton,
 roomJoinCodeLabel,
 roomJoinButton,
 roomWaitingTitle,
 roomWaitingDesc,
 roomExpiresIn,
 roomCopyButton,
 roomCopiedButton,
 roomCancelButton,
 playSheetFriendTitle,
 MAX_AMOUNT_DIGITS,
} from "@/constants/messages";
import CustomIconButton from "@/components/base/IconButton/IconButton";

const ROOM_TABS: RoomTab[] = ["create", "join"];
const BET_CHIP_AMOUNTS = [10, 25, 50, 100, 500];
const DURATION_MINUTES = Array.from({ length: 30 }, (_, i) => i + 1);
const DURATION_WHEEL_ITEM_HEIGHT = 44.8;

function DurationWheel({ value, onChange }: IDurationWheelProps) {
 const listRef = useRef<HTMLDivElement>(null);
 const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

 useEffect(() => {
  listRef.current?.scrollTo({
   top: (value - DURATION_MINUTES[0]) * DURATION_WHEEL_ITEM_HEIGHT,
  });
 }, []);

 const scrollToValue = (minutes: number) => {
  listRef.current?.scrollTo({
   top: (minutes - DURATION_MINUTES[0]) * DURATION_WHEEL_ITEM_HEIGHT,
   behavior: "smooth",
  });
 };

 const handleScroll = () => {
  clearTimeout(scrollTimeoutRef.current);
  scrollTimeoutRef.current = setTimeout(() => {
   const el = listRef.current;
   if (!el) return;
   const index = Math.round(el.scrollTop / DURATION_WHEEL_ITEM_HEIGHT);
   const picked =
    DURATION_MINUTES[Math.min(Math.max(index, 0), DURATION_MINUTES.length - 1)];
   if (picked !== value) onChange(picked);
  }, 120);
 };

 return (
  <Box customClass="duration-wheel">
   <Box customClass="duration-wheel-highlight" />
   <Box customClass="duration-wheel-list" ref={listRef} onScroll={handleScroll}>
    <Box customClass="duration-wheel-pad" />
    {DURATION_MINUTES.map((minutes) => (
     <Text
      key={minutes}
      customClass={classNames(
       "duration-wheel-item",
       minutes === value && "active",
      )}
      onClick={() => {
       onChange(minutes);
       scrollToValue(minutes);
      }}
     >
      {minutes} {roomMinutesSuffix}
     </Text>
    ))}
    <Box customClass="duration-wheel-pad" />
   </Box>
  </Box>
 );
}

export default function RoomSheet({
 open,
 onClose,
 onCancel,
 usdValue,
 roomStatus,
 roomCode,
 expiresInSeconds,
 onCreateRoom,
 onJoinRoom,
}: IRoomSheetProps) {
 const [roomTab, setRoomTab] = useState<RoomTab>("create");
 const [roomBet, setRoomBet] = useState("");
 const [roomBetError, setRoomBetError] = useState("");
 const [roomMinutes, setRoomMinutes] = useState(String(DURATION_MINUTES[4]));
 const [roomRated, setRoomRated] = useState(false);
 const [joinCode, setJoinCode] = useState("");
 const [codeCopied, setCodeCopied] = useState(false);

 useEffect(() => {
  if (!open) return;
  setRoomTab("create");
  setRoomBet("");
  setRoomBetError("");
  setRoomMinutes(String(DURATION_MINUTES[4]));
  setRoomRated(false);
  setJoinCode("");
 }, [open]);

 const handleCreateRoomSubmit = () => {
  const bet = Number(roomBet);
  if (!bet || bet <= 0) {
   setRoomBetError(roomBetRequired);
   return;
  }
  if (bet > usdValue) {
   setRoomBetError(roomBetInsufficientBalance);
   return;
  }
  setRoomBetError("");
  const minutes = Number(roomMinutes);
  if (!minutes || minutes <= 0) return;
  onCreateRoom(bet, Math.round(minutes * 60), roomRated);
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
  } catch {}
 };

 return (
  <CustomDrawer
   anchor="bottom"
   open={open}
   onClose={onClose}
   customClass="room-sheet"
  >
   {roomStatus === "waiting" ? (
    <Box customClass="matchmaking-searching">
     <Text customClass="dialog-title">{roomWaitingTitle}</Text>
     <Text customClass="empty-state-desc description">{roomWaitingDesc}</Text>
     <Text customClass="searching-timer">{roomCode}</Text>
     <Text customClass="empty-state-desc description">
      {roomExpiresIn(formatMMSS(expiresInSeconds))}
     </Text>
     <Button
      type="button"
      variant="outlined"
      fullWidth
      customClass="pool-confirm-cancel-btn"
      startIcon={codeCopied ? "check" : "copy"}
      onClick={handleCopyCode}
     >
      {codeCopied ? roomCopiedButton : roomCopyButton}
     </Button>
     <Box customClass="pool-confirm-actions">
      <Button
       type="button"
       variant="outlined"
       fullWidth
       customClass="pool-confirm-cancel-btn"
       onClick={onCancel}
      >
       {roomCancelButton}
      </Button>
     </Box>
    </Box>
   ) : (
    <Box customClass="matchmaking-searching room-options">
     <Text customClass="sheet-title dialog-title">{playSheetFriendTitle}</Text>
     <ChipSelect
      options={ROOM_TABS}
      value={roomTab}
      onChange={setRoomTab}
      label={(t) => (t === "create" ? roomCreateTabLabel : roomJoinTabLabel)}
      customClass="segment compact"
     />
     {roomTab === "create" ? (
      <>
       <Box customClass="room-field room-bet-field">
        <CustomLabel
         htmlFor="room-bet"
         customClass="room-field-label room-bet-label"
        >
         {roomBetLabel}
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
         {roomTimeLabel}
        </CustomLabel>
        <DurationWheel
         value={Number(roomMinutes)}
         onChange={(minutes) => setRoomMinutes(String(minutes))}
        />
       </Box>

       <Box sx={{ display: "none !important" }} customClass="stat-row">
        <Text component="span">{roomRatedLabel}</Text>
        <CustomSwitch
         checked={roomRated}
         onChange={(e) => setRoomRated(e.target.checked)}
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
         {roomCreateButton}
        </Button>
       </Box>
      </>
     ) : (
      <>
       <Box customClass="room-field">
        <Box customClass="room-field-head">
         <CustomLabel customClass="room-field-label">{roomJoinCodeLabel}</CustomLabel>
         <CustomIconButton customClass="room-paste-btn" onClick={handlePasteCode} icon="contentPaste" />
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
        {roomJoinButton}
       </Button>
      </>
     )}
    </Box>
   )}
  </CustomDrawer>
 );
}
