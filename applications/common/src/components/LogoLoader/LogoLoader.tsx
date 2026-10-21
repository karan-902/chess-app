import type { BoxProps } from "@mui/material";
import Box from "@gopvp/common/src/components/Box/Box";

export default function LogoLoader(props: Omit<BoxProps, "ref">) {
 return (
  <Box customClass="logo-loader" {...props}>
   <span className="logo-loader-band" />
  </Box>
 );
}
