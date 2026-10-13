import { useState } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Button from "@gopvp/common/src/components/Button/Button";
import Text from "@gopvp/common/src/components/Text/Text";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import ChipSelect from "@gopvp/common/src/components/ChipSelect/ChipSelect";
import { TIME_SECONDS } from "@gopvp/chess/src/config/timeControl";
import {
 CATEGORY_LABELS,
 DIFFICULTY_LABELS,
} from "@gopvp/chess/src/constants/label";
import type {
 Difficulty,
 IPracticeSheetProps,
} from "@gopvp/chess/src/types/component";
import type { GameCategory } from "@gopvp/chess/src/types/index";
import { formatText } from "@gopvp/common/src/util/format";
import { playText, practiceText } from "@gopvp/common/src/constants/message";
import {
 minutesText,
 modeText,
 pickLevelSetClockText,
 playFreeText,
 difficultyText,
 timeControlText,
} from "@gopvp/chess/src/constants/message";
import {
 PRACTICE_DIFFICULTIES,
 CATEGORY_ORDER,
} from "@gopvp/chess/src/constants/option";
import SheetActions from "@gopvp/common/src/components/SheetActions/SheetActions";

export default function PracticeSheet({
 open,
 onClose,
 onPlay,
}: IPracticeSheetProps) {
 const [difficulty, setDifficulty] = useState<Difficulty>("easy");
 const [timeControl, setTimeControl] = useState<GameCategory>("RAPID");

 return (
  <CustomDrawer
   anchor="bottom"
   open={open}
   onClose={onClose}
   customClass="practice-sheet"
  >
   <Box customClass="matchmaking-searching practice-options">
    <Text customClass="dialog-title">
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
    </Box>
    <SheetActions>
     <Button
      type="button"
      variant="contained"
      fullWidth
      customClass="options-play"
      onClick={() => onPlay(difficulty, timeControl)}
     >
      {playText}
     </Button>
    </SheetActions>
   </Box>
  </CustomDrawer>
 );
}
