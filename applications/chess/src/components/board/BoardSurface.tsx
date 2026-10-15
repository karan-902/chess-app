import Box from "@gopvp/common/src/components/Box/Box";
import {
 LIGHT_SQUARE_COLOR,
 DARK_SQUARE_COLOR,
} from "@gopvp/chess/src/constants/color";
import "./board.scss";

export default function BoardSurface() {
 return (
  <Box customClass="chess-board fit-board">
   <Box customClass="chess-board-grid">
    {Array.from({ length: 64 }, (_, i) => (
     <Box
      key={i}
      customClass="chess-board-square"
      sx={{
       background:
        (i + Math.floor(i / 8)) % 2 === 0
         ? LIGHT_SQUARE_COLOR
         : DARK_SQUARE_COLOR,
      }}
     />
    ))}
   </Box>
  </Box>
 );
}
