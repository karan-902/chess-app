import { useState } from "react";
import Box from "@gopvp/common/src/components/Box/Box";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomDrawer from "@gopvp/common/src/components/Drawer/Drawer";
import ChipSelect from "@gopvp/common/src/components/ChipSelect/ChipSelect";
import { TIME_SECONDS } from "@gopvp/chess/src/constants";
import { CATEGORY_META } from "@gopvp/chess/src/constants/config";
import type { Difficulty } from "@gopvp/chess/src/types/component";
import type { GameCategory } from "@gopvp/chess/src/types/index";
import type { IPracticeSheetProps } from "@gopvp/chess/src/types/component";
import { playText, cancelText } from "@gopvp/common/src/constants/messages";
import {
 difficultyText,
 minutesText,
} from "@gopvp/chess/src/constants/messages";

const PRACTICE_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const CATEGORY_ORDER: GameCategory[] = [
 "BULLET",
 "BLITZ",
 "RAPID",
 "CLASSICAL",
];

export default function PracticeSheet({
 open,
 onClose,
 onCancel,
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
    <ChipSelect
     options={PRACTICE_DIFFICULTIES}
     value={difficulty}
     onChange={setDifficulty}
     label={(d) => difficultyText[d]}
     customClass="segment compact"
    />
    <ChipSelect
     options={CATEGORY_ORDER}
     value={timeControl}
     onChange={setTimeControl}
     label={(c) => CATEGORY_META[c]?.label}
     subLabel={(c) => minutesText(TIME_SECONDS[c] / 60)}
     customClass="segment category-select"
    />
    <Box customClass="pool-confirm-actions">
     <Button
      type="button"
      variant="contained"
      fullWidth
      customClass="options-play"
      onClick={() => onPlay(difficulty, timeControl)}
     >
      {playText}
     </Button>
     <Button
      type="button"
      variant="outlined"
      fullWidth
      customClass="pool-confirm-cancel-btn"
      onClick={onCancel}
     >
      {cancelText}
     </Button>
    </Box>
   </Box>
  </CustomDrawer>
 );
}
