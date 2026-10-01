import { Link } from "react-router-dom";
import Box from "@gopvp/common/src/components/Box/Box";
import Text from "@gopvp/common/src/components/Text/Text";
import { icons } from "@gopvp/common/src/components/images";
import { GAMES, type GameSlug } from "@gopvp/app/src/config/game";
import { getGameRoutes } from "@gopvp/app/src/utils";
import { pickAGameText } from "@gopvp/app/src/constants/message";

export default function GamePicker() {
 return (
  <Box customClass="game-picker">
   <Text component="h1" customClass="dialog-title">
    {pickAGameText}
   </Text>
   <Box customClass="game-picker-list">
    {(Object.keys(GAMES) as GameSlug[]).map((slug) => (
     <Link
      key={slug}
      to={getGameRoutes(slug).PLAY}
      style={{ textDecoration: "none" }}
     >
      <Box customClass="game-picker-row">
       <Box customClass="game-picker-logo">
        <img src={GAMES[slug].module.logoSrc} alt="" />
       </Box>
       <Text customClass="row-title">{GAMES[slug].label}</Text>
       <icons.arrowForward />
      </Box>
     </Link>
    ))}
   </Box>
  </Box>
 );
}
