import { Backdrop } from "@mui/material";
import Text from "@gopvp/common/src/components/Text/Text";
import Card from "@gopvp/common/src/components/Card/Card";
import Box from "@gopvp/common/src/components/Box/Box";
import { useReduxSelector } from "@gopvp/app/src/redux/hooks";
import "./backdrop-loader.scss";

export default function BackdropLoader() {
 const { open, text } = useReduxSelector((state) => state.common.loader);

 return (
  <Backdrop open={open} className="common-backdrop-loader">
   <Card customClass="backdrop-loader-card">
    <Box customClass="logo-loader" aria-hidden />
    <Text customClass="caption loader-text">{text}</Text>
   </Card>
  </Backdrop>
 );
}
