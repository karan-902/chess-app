import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import Button from "@gopvp/common/src/components/Button/Button";
import CustomIconButton from "@gopvp/common/src/components/IconButton/IconButton";
import { icons } from "@gopvp/common/src/components/images";
import { GAMES, type GameSlug } from "@gopvp/app/src/config/game";
import { getGamePath } from "@gopvp/app/src/utils";
import { useReduxDispatch } from "@gopvp/app/src/redux/hooks";
import { setActivePage } from "@gopvp/app/src/redux/game/slice";
import {
 pickYourText,
 gameText,
 pickGameFaceRivalText,
 cashOutText,
 comingSoonText,
 previousGameText,
 nextGameText,
 playNowText,
} from "@gopvp/app/src/constants/message";
import { GAME_PICKER_SPARKLE_COUNT } from "@gopvp/app/src/constants/limit";

const gameSlugs = Object.keys(GAMES) as GameSlug[];

export default function GamePicker() {
 const dispatch = useReduxDispatch();
 const navigate = useNavigate();
 const [activeIndex, setActiveIndex] = useState(0);
 const activeSlug = gameSlugs[activeIndex];
 const hasMultipleGames = gameSlugs.length > 1;

 const showGame = (step: number) =>
  setActiveIndex(
   (index) => (index + step + gameSlugs.length) % gameSlugs.length,
  );

 const handlePlay = () => {
  dispatch(setActivePage("PLAY"));
  navigate(getGamePath(activeSlug));
 };

 return (
  <Box customClass="game-picker">
   <Box customClass="game-picker-heading">
    <Text component="h1" customClass="game-picker-title">
     {pickYourText}{" "}
     <Text component="span" customClass="public-title-accent">
      {gameText}
     </Text>
    </Text>
    <Text component="p" customClass="page-subtitle public-subtitle">
     {pickGameFaceRivalText}{" "}
     <Text component="span" customClass="public-subtitle-accent">
      {cashOutText}
     </Text>
    </Text>
   </Box>

   <Box customClass="game-picker-body">
    <Box customClass="game-picker-stage">
     <Box customClass="game-picker-peek prev">
      <icons.lock />
     </Box>
     <Box customClass="game-picker-peek next">
      <icons.lock />
     </Box>
     <Box customClass="game-picker-rings" />
     <Box customClass="game-picker-podium" />
     <img
      src={GAMES[activeSlug].module.logoSrc}
      alt={GAMES[activeSlug].label}
     />
     <Box customClass="game-picker-sparkles">
      {Array.from({ length: GAME_PICKER_SPARKLE_COUNT }, (_, index) => (
       <icons.sparkle key={index} />
      ))}
     </Box>
     <CustomIconButton
      icon="chevronLeft"
      customClass="game-picker-nav prev"
      aria-label={previousGameText}
      disabled={!hasMultipleGames}
      onClick={() => showGame(-1)}
     />
     <CustomIconButton
      icon="chevronRight"
      customClass="game-picker-nav next"
      aria-label={nextGameText}
      disabled={!hasMultipleGames}
      onClick={() => showGame(1)}
     />
    </Box>

    <Box customClass="game-picker-names">
     <Text customClass="game-picker-soon prev">{comingSoonText}</Text>
     <Text component="h2" customClass="game-picker-name">
      {GAMES[activeSlug].label}
     </Text>
     <Text customClass="game-picker-soon next">{comingSoonText}</Text>
    </Box>
   </Box>

   <Button
    type="button"
    variant="contained"
    fullWidth
    customClass="play-cta game-picker-cta"
    onClick={handlePlay}
   >
    {playNowText}
   </Button>
  </Box>
 );
}
