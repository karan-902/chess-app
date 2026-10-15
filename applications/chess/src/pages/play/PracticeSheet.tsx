import { useRef, useState } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Button from "@gopvp/common/src/components/Button/Button";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import CustomAvatar from "@gopvp/common/src/components/Avatar/Avatar";
import ChipSelect from "@gopvp/common/src/components/ChipSelect/ChipSelect";
import { icons } from "@gopvp/common/src/components/images";
import { TIME_SECONDS } from "@gopvp/chess/src/config/timeControl";
import {
 // CATEGORY_LABELS,
 DIFFICULTY_LABELS,
} from "@gopvp/chess/src/constants/label";
import type {
 Difficulty,
 IPracticeSheetProps,
} from "@gopvp/chess/src/types/component";
import type { GameCategory } from "@gopvp/chess/src/types/index";
// import { formatText } from "@gopvp/common/src/util/format";
import { practiceText } from "@gopvp/common/src/constants/message";
import {
 minutesText,
 // modeText,
 // pickLevelSetClockText,
 // playFreeText,
 // difficultyText,
 // timeControlText,
 warmUpBeforeMatchText,
 freePlayTicketText,
 challengeText,
 timeText,
 vsText,
 playFreeButtonText,
} from "@gopvp/chess/src/constants/message";
import {
 PRACTICE_DIFFICULTIES,
 CATEGORY_ORDER,
} from "@gopvp/chess/src/constants/option";
import SheetActions from "@gopvp/common/src/components/SheetActions/SheetActions";

export default function PracticeSheet({
 open,
 username,
 onClose,
 onPlay,
}: IPracticeSheetProps) {
 const [difficulty, setDifficulty] = useState<Difficulty>("easy");
 const [timeControl, setTimeControl] = useState<GameCategory>("RAPID");
 const ticketRef = useRef<HTMLDivElement>(null);

 return (
  <CustomDrawer
   anchor="bottom"
   open={open}
   onClose={onClose}
   customClass="practice-sheet"
  >
   <Box customClass="practice-options">
    <Box customClass="public-heading">
     <Text customClass="sheet-title dialog-title">{practiceText}</Text>
     <Text customClass="page-subtitle public-subtitle">{warmUpBeforeMatchText}</Text>
    </Box>
    {/* <Text customClass="dialog-title">
     {practiceText} <b>{modeText}</b>
    </Text>
    <Text customClass="sheet-subtitle">
     {pickLevelSetClockText} <b>{playFreeText}</b>
    </Text>
    <Box customClass="practice-field">
     <Text customClass="field-label">{difficultyText}</Text>
     <ChipSelect
      options={PRACTICE_DIFFICULTIES}
      value={difficulty}
      onChange={setDifficulty}
      label={(d) => DIFFICULTY_LABELS[d]}
      customClass="segment"
     />
    </Box>
    <Box customClass="practice-field">
     <Text customClass="field-label">{timeControlText}</Text>
     <ChipSelect
      options={CATEGORY_ORDER}
      value={timeControl}
      onChange={setTimeControl}
      label={(c) => formatText(CATEGORY_LABELS[c])}
      subLabel={(c) => minutesText(TIME_SECONDS[c] / 60)}
      customClass="segment category-select"
     />
    </Box> */}
    <Box ref={ticketRef} customClass="practice-ticket">
     <Box customClass="practice-ticket-stub">
      <Text component="span" customClass="practice-ticket-stub-label">
       {freePlayTicketText}
      </Text>
     </Box>
     <Box customClass="practice-ticket-players">
      <CustomAvatar
       letter={username.charAt(0).toUpperCase()}
       customClass="ticket-me"
      />
      <Text component="span" customClass="ticket-vs">
       {vsText}
      </Text>
      <Box customClass="practice-ticket-bot">
       <icons.bot />
      </Box>
     </Box>
     <Box customClass="practice-ticket-perf" data-tear-line />
     <Box customClass="practice-ticket-field">
      <Text customClass="practice-ticket-label">{challengeText}</Text>
      <ChipSelect
       options={PRACTICE_DIFFICULTIES}
       value={difficulty}
       onChange={setDifficulty}
       label={(d) => DIFFICULTY_LABELS[d]}
       customClass="segment ticket-pills"
      />
     </Box>
     <Box customClass="practice-ticket-field">
      <Text customClass="practice-ticket-label">{timeText}</Text>
      <ChipSelect
       options={CATEGORY_ORDER}
       value={timeControl}
       onChange={setTimeControl}
       label={(c) => minutesText(TIME_SECONDS[c] / 60)}
       customClass="segment ticket-pills"
      />
     </Box>
    </Box>
    <SheetActions>
     <Button
      type="button"
      variant="contained"
      fullWidth
      customClass="game-cta play-cta tilted"
      onClick={() => onPlay(difficulty, timeControl, ticketRef.current)}
     >
      {playFreeButtonText}
     </Button>
    </SheetActions>
   </Box>
  </CustomDrawer>
 );
}
