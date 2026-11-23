import type { BoxProps } from "@mui/material";
import Box from "@gopvp/common/src/components/Box/Box";
import CanvasAnimation from "@gopvp/common/src/components/CanvasAnimation/CanvasAnimation";
import { LOGO_PATH } from "@gopvp/common/src/constants/asset";
import {
 LOGO_LOADER_BAND_RATIO,
 LOGO_LOADER_SWEEP_MS,
} from "@gopvp/common/src/constants/limit";
import type { ICanvasAnimationProps } from "@gopvp/common/src/types/component";

const logoImage = new Image();
logoImage.src = LOGO_PATH;

const drawBand: ICanvasAnimationProps["draw"] = (
 ctx,
 { elapsed, width, height },
) => {
 if (!logoImage.naturalWidth) return true;
 const bandWidth = width * LOGO_LOADER_BAND_RATIO;
 const sweep = (elapsed % LOGO_LOADER_SWEEP_MS) / LOGO_LOADER_SWEEP_MS;
 const left = sweep * (width + bandWidth) - bandWidth;
 const band = ctx.createLinearGradient(left, 0, left + bandWidth, 0);
 band.addColorStop(0, "transparent");
 band.addColorStop(0.4, "black");
 band.addColorStop(0.6, "black");
 band.addColorStop(1, "transparent");
 ctx.drawImage(logoImage, 0, 0, width, height);
 ctx.globalCompositeOperation = "destination-in";
 ctx.fillStyle = band;
 ctx.fillRect(0, 0, width, height);
 ctx.globalCompositeOperation = "source-over";
 return true;
};

export default function LogoLoader(props: Omit<BoxProps, "ref">) {
 return (
  <Box customClass="logo-loader" {...props}>
   <CanvasAnimation customClass="logo-loader-band" draw={drawBand} />
  </Box>
 );
}
